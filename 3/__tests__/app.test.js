const { response } = require('express')
const request = require('supertest')
const app = require('../app')
let token
const userData = {
    username: "raka",
    password: "123"
}

beforeAll((done) => {
    request(app)
        .post('/login')
        .send(userData)
        .end((err, res) => {
            token = res.body.token
            done()
        })
})

describe('POST Login', () => {
    test('harusnya ngasih response sukses login dengan kode 200', (done) => {
        request(app)
        .post("/login")
        .send(userData)
        .end(function (err, result) {
            expect(result.status).toBe(200)
            expect(typeof result.body).toBe("object")
            expect(result.body).toHaveProperty("token")
            expect(typeof result.body.token).toBe("string")
            done()
        })
    })

    test('harusnya ngasih response gagal login dengan kode 401', (done) => {
        request(app)
        .post("/login")
        .end(function (err, result) {
            expect(result.status).toBe(401)
            expect(typeof result.body).toBe("object")
            expect(result.body).not.toHaveProperty("token")
            done()
        })
    })

    test('harusnya ngasih response gagal login dengan kode 401 karena data tidak cocok', (done) => {
        request(app)
        .post("/login")
        .send({
            username: "raka",
            password: "321"
        })
        .end(function (err, result) {
            expect(result.status).toBe(401)
            expect(typeof result.body).toBe("object")
            expect(result.body).not.toHaveProperty("token")
            done()
        })
    })
})

describe('GET Data', () => {
    test('harusnya ngasih response code 401 karena tidak melempar token', () => {
        return request(app)
            .get('/data')
            .then((response) => {
                expect(response.statusCode).toBe(401)
            })
    })

    test('harusnya ngasih response code 200', () => {
        return request(app)
            .get('/data')
            .set('token', token)
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(typeof response).toBe('object')
                expect(response.body).not.toBeNull()
                expect.arrayContaining(response.body)
            })
    })
})

