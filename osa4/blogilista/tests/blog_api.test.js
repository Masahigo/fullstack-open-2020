const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpwd', 10)
    const user = new User({ username: 'testblogger', name: 'Test Blogger', passwordHash })

    await user.save()
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
        const usersAtStart = await helper.usersInDb()
        //console.log('first user in db:', usersAtStart[0])

        const newBlog = {
            title: 'Tech blog about public clouds and devops using MS stack.',
            author: 'Masi Malmi',
            url: 'https://msdevopsdude.com',
            likes: 1000,
            userId: usersAtStart[0].id
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
        const usersAtStart = await helper.usersInDb()

        const newBlog = {
            title: 'The best posts about DevOps',
            author: 'Polar Squad',
            url: 'https://polarsquad.com/blog',
            userId: usersAtStart[0].id,
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

    test('a blog cannot be added without title and url fields (bad request)', async () => {
        const newBlog = {
            author: 'John Doe'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog cannot be added without valid userid', async () => {

        const newBlog = {
            title: 'Dummy blog without valid user id.',
            author: 'John Doe',
            url: 'https://dummyblog.com',
            userId: '12345'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    describe('deletion of a blog', () => {

        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(
                helper.initialBlogs.length - 1
            )

            const ids = blogsAtEnd.map(b => b.id)

            expect(ids).not.toContain(blogToDelete.id)
        })

    })

    describe('updating a blog', () => {

        test('a specific blog can be updated', async () => {
          const blogsAtStart = await helper.blogsInDb()
          const blogToUpdate = blogsAtStart[0]
    
          blogToUpdate.title = 'React patterns - need to look into those.'
          blogToUpdate.likes = 8
    
          const resultBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
          const processedBlogToUpdate = JSON.parse(JSON.stringify(blogToUpdate))
          expect(resultBlog.body).toEqual(processedBlogToUpdate)
        })
    
      })

});

afterAll(() => {
    mongoose.connection.close()
})