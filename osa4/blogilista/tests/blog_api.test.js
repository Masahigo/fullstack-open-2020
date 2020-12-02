const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('Blog API tests', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blog has correct id field', async () => {
        const response = await api.get('/api/blogs')
        const blogToTest = response.body[0]

        expect(blogToTest.id).toBeDefined();
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Tech blog about public clouds and devops using MS stack.',
            author: 'Masi Malmi',
            url: 'https://msdevopsdude.com',
            likes: 1000
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const contents = blogsAtEnd.map(b => b.title)

        expect(contents).toContain(
            'Tech blog about public clouds and devops using MS stack.'
        )
    })

    test('a blog can be added without likes property', async () => {
        const newBlog = {
            title: 'The best posts about DevOps',
            author: 'Polar Squad',
            url: 'https://polarsquad.com/blog',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const lastBlog = [...blogsAtEnd].pop()

        expect(lastBlog.likes).toBe(0)
    })

});

afterAll(() => {
    mongoose.connection.close()
})