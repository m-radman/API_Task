const request = require("supertest")
const { faker } = require("@faker-js/faker")

const BASE_URL = "https://demoqa.com"

let TOKEN
const username = "moki"
const password = "AraRara1123!"

describe("Login user tests", () => {
    it("Generate users Bearer token successfully", async () => {
        const response = await request(BASE_URL).post("/Account/v1/GenerateToken")
            .send({
                userName: username,
                password: password
            })
        expect(response.status).toEqual(200)
        expect(response.body.status).toBe("Success")

        TOKEN = response.body.token
    })

    it("Fail to generate users Bearer token with invalid credentials", async () => {
        const response = await request(BASE_URL).post("/Account/v1/GenerateToken")
            .send({
                userName: username,
                password: "password"
            })
        expect(response.status).toEqual(200)
        expect(response.body.status).toBe("Failed")
    })

    it("Successfully login user with valid credentials", async () => {
        const response = await request(BASE_URL).post("/Account/v1/Login")
            .send({
                userName: username,
                password: password
            })
        expect(response.status).toEqual(200)
        expect(response.body.username).toEqual(username)
        expect(response.body.token).toEqual(TOKEN)
        expect(response.body).toHaveProperty("userId")
    })
    
    it("Fail to login user with invalid credentials", async () => {
        const response = await request(BASE_URL).post("/Account/v1/Login")
            .send({
                userName: "username",
                password: "password"
            })
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({})
    })

    it("Fail to login user with wrong url path", async () => {
        const response = await request(BASE_URL).post("/Account/v1/Log")
            .send({
                userName: username,
                password: password
            })
        expect(response.status).toEqual(404)
    })
})