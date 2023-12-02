const request = require("supertest")

const BASE_URL = "https://demoqa.com"

const username = "moki"
const password = "AraRara1123!"

describe("Register user tests", () => {
    it("Register new user successfully", async () => {
        const response = await request(BASE_URL).post("/Account/v1/User")
            .send({
                userName: username,
                password: password + Math.random()
            })
        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty("userID")
    })

    it("Fail to register user with already taken password", async () => {
        const response = await request(BASE_URL).post("/Account/v1/User")
        .send({
            userName: username,
            password: password
        })
        expect(response.status).toEqual(406)
        expect(response.body).toHaveProperty("message", "User exists!")
    })

    it("Fail to register user if password does not meets the requirements", async () => {
        const response = await request(BASE_URL).post("/Account/v1/User")
        .send({
            userName: username,
            password: "password"
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toContain("Passwords must have at least")
    })

    it("Fail to register with empty field in request body", async () => {
        const response = await request(BASE_URL).post("/Account/v1/User")
        .send({
            userName: "",
            password: password
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toContain("UserName and Password required")
    })

    it("Fail to register due to misspelled url path", async () => {
        const response = await request(BASE_URL).post("/Account/v1/Use")
        .send({
            userName: username,
            password: password
        })
        expect(response.status).toEqual(404)
    })
})