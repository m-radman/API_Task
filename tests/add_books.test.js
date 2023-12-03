const request = require("supertest")
const { BASE_URL, USER_1 } = require("../helpers/constants")

const BOOK_ISBN_TO_ADD_TO_COLLECTION = "9781593277574"
let USER_TOKEN = ''

describe("Books addition tests", () => {

    beforeAll(async () => {
        const authResponse = await request(BASE_URL).post('/Account/v1/GenerateToken')
            .send({
                userName: USER_1.userName,
                password: USER_1.password
            })

        await request(BASE_URL).post('/Account/v1/Login')
            .send({
                userName: USER_1.userName,
                password: USER_1.password
            })

        USER_TOKEN = authResponse.body.token

        await request(BASE_URL).delete(`/BookStore/v1/Books?UserId=${USER_1.userId}`).set("Authorization", `Bearer ${USER_TOKEN}`)
    })

    afterAll(async () => {
        await request(BASE_URL).delete(`/BookStore/v1/Books?UserId=${USER_1.userId}`).set("Authorization", `Bearer ${USER_TOKEN}`)
    })

    it("Get list of all books", async () => {
        const response = await request(BASE_URL).get("/Bookstore/v1/Books")

        expect(response.body.books).toHaveLength(8)
    })

    it("Add book to users collection", async () => {
        const response = await request(BASE_URL).post("/Bookstore/v1/Books")
            .set("Authorization", `Bearer ${USER_TOKEN}`)
            .send({
                userId: USER_1.userId,
                collectionOfIsbns: [
                    {
                        isbn: BOOK_ISBN_TO_ADD_TO_COLLECTION
                    }
                ]
            })
        expect(response.status).toBe(201)
        expect(response.body.books).toHaveLength(1)

        const userResponse = await request(BASE_URL).get(`/Account/v1/User/${USER_1.userId}`)
            .set("Authorization", `Bearer ${USER_TOKEN}`)
        expect(userResponse.body.books[0].isbn).toEqual(BOOK_ISBN_TO_ADD_TO_COLLECTION)
    })

    it("Fail to add same book to users collection", async () => {
        const response = await request(BASE_URL).post("/Bookstore/v1/Books")
            .set("Authorization", `Bearer ${USER_TOKEN}`)
            .send({
                userId: USER_1.userId,
                collectionOfIsbns: [
                    {
                        isbn: BOOK_ISBN_TO_ADD_TO_COLLECTION
                    }
                ]
            })
        expect(response.status).toBe(400)
        expect(response.body.message).toContain("ISBN already present")
    })

    it("Fail to add book with wrong isbn to users collection", async () => {
        const response = await request(BASE_URL).post("/Bookstore/v1/Books")
            .set("Authorization", `Bearer ${USER_TOKEN}`)
            .send({
                userId: USER_1.userId,
                collectionOfIsbns: [
                    {
                        isbn: "978144932586"
                    }
                ]
            })
        expect(response.status).toBe(400)
        expect(response.body.message).toContain("ISBN supplied is not available")
    })

    it("Fail to add book to users collection with invalid userID", async () => {
        const response = await request(BASE_URL).post("/Bookstore/v1/Books")
            .set("Authorization", `Bearer ${USER_TOKEN}`)
            .send({
                userId: "4d328c96-ebe5-4c60-b273-4a8d3515f35",
                collectionOfIsbns: [
                    {
                        isbn: BOOK_ISBN_TO_ADD_TO_COLLECTION
                    }
                ]
            })
        expect(response.status).toBe(401)
        expect(response.body.message).toContain("User Id not correct")
    })
})