const request = require("supertest")
const { BASE_URL, USER_4 } = require("../helpers/constants")

const BOOK_ISBN_TO_ADD_TO_COLLECTION = "9781593277574"
let USER_TOKEN = ''

describe("Delete books tests", () => {
    beforeAll(async () => {
        const authResponse = await request(BASE_URL).post('/Account/v1/GenerateToken')
            .send({
                userName: USER_4.userName,
                password: USER_4.password
            })

        await request(BASE_URL).post('/Account/v1/Login')
            .send({
                userName: USER_4.userName,
                password: USER_4.password
            })

        USER_TOKEN = authResponse.body.token

        await request(BASE_URL).post("/Bookstore/v1/Books")
            .set("Authorization", `Bearer ${USER_TOKEN}`)
            .send({
                userId: USER_4.userId,
                collectionOfIsbns: [
                    {
                        isbn: BOOK_ISBN_TO_ADD_TO_COLLECTION
                    }
                ]
            })
    })

    it("Delete users collection of books successfully", async () => {
        const response =  await request(BASE_URL).delete(`/BookStore/v1/Books?UserId=${USER_4.userId}`)
            .set("Authorization", `Bearer ${USER_TOKEN}`)
        expect(response.status).toBe(204)
        expect(response.body).toEqual({})

        const userResponse = await request(BASE_URL).get(`/Account/v1/User/${USER_4.userId}`)
            .set("Authorization", `Bearer ${USER_TOKEN}`)
        expect(userResponse.body.books).toEqual([])
    })

    it("Fail to delete users collection of books with invalid userID", async () => {
        const response =  await request(BASE_URL).delete(`/BookStore/v1/Books?UserId=${USER_4.userId}a`)
            .set("Authorization", `Bearer ${USER_TOKEN}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toContain("User Id not correct")
    })

    it("Fail to delete users collection of books when unauthorized", async () => {
        const response =  await request(BASE_URL).delete(`/BookStore/v1/Books?UserId=${USER_4.userId}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toContain("User not authorized")
    })
})