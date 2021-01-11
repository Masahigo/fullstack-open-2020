const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpwd', 10)
    const user = new User({ username: 'testblogger', name: 'Test Blogger', passwordHash })

    await user.save()
})

describe('Login API tests', () => {

    test('login succeeds with http 200 when using valid credentials', async () => {

        const credentials = {
            username: 'testblogger',
            password: 'secretpwd'
        }

        await api
            .post('/api/login')
            .send(credentials)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('login fails with http 401 (unauthorized) when using invalid (nonexistent) username', async () => {

        const credentials = {
            username: 'nonexistent ',
            password: 'pwd'
        }

        const result = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('invalid username or password')
    })

    test('login fails with http 401 (unauthorized) when using false password', async () => {

        const credentials = {
            username: 'testblogger ',
            password: 'wrongpassword'
        }

        const result = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('invalid username or password')
    })

})

afterAll(() => {
    mongoose.connection.close()
})