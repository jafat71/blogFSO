
const supertest = require('supertest')
const mongoose = require('mongoose')

const { blogs } = require("./blogs_helper");
const Blog = require('../models/blog')
const User = require('../models/user');

const app = require('../app');
const api = supertest(app)

describe('api express api test', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        const usersObjects = blogs.map(blog => new Blog(blog))
        await Promise.all(usersObjects.map(blog => blog.save()))
    })

    test('returns the correct amount of blog posts in the JSON format', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(blogs.length);
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
        const newBlog = {
            _id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            url: "https://google.com/",
            likes: 11,
            __v: 0
        }

        const response = await api.post('/api/blogs').send(newBlog)
        expect(response.body).toEqual({
            id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            url: "https://google.com/",
            likes: 11
        })

        const fullBlogsResponse = await api.get('/api/blogs')
        expect(fullBlogsResponse.body).toHaveLength(blogs.length + 1);
    })

    test('if the likes property is missing from the request, it will default to the value 0', async () => {
        const newBlog = {
            _id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            url: "https://google.com/",
            __v: 0
        }
        const response = await api.post('/api/blogs').send(newBlog)
        expect(response.body.likes).toBe(0)
    })

    test('if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
        const newBlog = {
            _id: "5a422a851b54a676234d13b2",
            author: "John Doe",
            url: "https://google.com/",
            __v: 0
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
        const newBlog2 = {
            _id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            __v: 0
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
    })
    test('deleting a single blog post resource', async () => {
        const responseFullBlogsInit = await api.get('/api/blogs')
        const newBlog = {
            _id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            url: "https://google.com/",
            likes: 7,
            __v: 0
        }
        const responseCreation = await api.post('/api/blogs').send(newBlog)
        await api.delete('/api/blogs/' + responseCreation.body.id).expect(200)
        const responseFullBlogsFinal = await api.get('/api/blogs')
        expect(responseFullBlogsFinal.body).toHaveLength(responseFullBlogsInit.body.length)
    })

    test(' updating the information of an individual blog post', async () => {
        const newBlog = {
            _id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            url: "https://google.com/",
            likes: 7,
            __v: 0
        }
        const responseCreation = await api.post('/api/blogs').send(newBlog)
        const updatedNote = await api.put('/api/blogs/' + responseCreation.body.id).send({ ...responseCreation.body, likes: responseCreation.body.likes + 1 })
        expect(updatedNote.body).toEqual({
            id: "5a422a851b54a676234d13b2",
            title: "Express Test",
            author: "John Doe",
            url: "https://google.com/",
            likes: 8
        })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})

describe.only('User Tests', () => {

    test('ensure invalid users are not created', async () => {
        const newUserOne = {
            "username": "LL",
            "name": "Hellboy",
            "password": "1234"
        }

        const responseOne = await api.post('/api/users').send(newUserOne).expect(400)
        expect(responseOne.body.error).toBe("User validation failed: username: Path `username` (`LL`) is shorter than the minimum allowed length (3).")

        const newUserTwo = {
            "name": "Hellboy",
            "password": "1234"
        }

        const responseTwo = await api.post('/api/users').send(newUserTwo).expect(400)
        expect(responseTwo.body.error).toBe("User validation failed: username: Path `username` is required.")
        const newUserThree = {
            "username": "LL",
            "name": "Hellboy"
        }

        const responseThree = await api.post('/api/users').send(newUserThree).expect(400)
        expect(responseThree.body.msg).toBe("Password must be at least three characters long")
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})