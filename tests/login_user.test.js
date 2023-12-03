const request = require("supertest")
const { BASE_URL, USER_2 } = require("../helpers/constants")

let TOKEN

describe("Login user tests", () => {
    it("Generate users token and successfully login", async () => {
        const authResponse = await request(BASE_URL).post("/Account/v1/GenerateToken")
            .send({
                userName: USER_2.userName,
                password: USER_2.password
            })
        expect(authResponse.status).toEqual(200)
        expect(authResponse.body.status).toBe("Success")

        TOKEN = authResponse.body.token

        const loginResponse = await request(BASE_URL).post("/Account/v1/Login")
            .send({
                userName: USER_2.userName,
                password: USER_2.password
            })
        expect(loginResponse.status).toEqual(200)
        expect(loginResponse.body.username).toEqual(USER_2.userName)
        expect(loginResponse.body.token).toEqual(TOKEN)
        expect(loginResponse.body).toHaveProperty("userId")
    })

    it("Fail to generate users Bearer token with invalid credentials", async () => {
        const response = await request(BASE_URL).post("/Account/v1/GenerateToken")
            .send({
                userName: USER_2.userName,
                password: "password"
            })
        expect(response.status).toEqual(200)
        expect(response.body.status).toBe("Failed")
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
                userName: USER_2.userName,
                password: USER_2.password
            })
        expect(response.status).toEqual(404)
    })
})