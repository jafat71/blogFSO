const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middlewares')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {

    const user = request.user
    const body = request.body
    if (!body.title || !body.url) {
        response.status(400).json({
            error: 'BAD REQUEST'
        })
    }
    const blog = new Blog({ ...body, likes: body.likes || 0, user: user.id })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)

})

blogRouter.delete('/:id', async (request, response) => {

    const userDeleter = request.user
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
        response.status(400).json({
            error: 'BAD REQUEST || Blog not exist'
        })
    }
    let creatorID = blog.user.toString()

    if (userDeleter.id === creatorID) {
        await Blog.findByIdAndDelete(id)
        userDeleter.blogs = userDeleter.blogs.filter(blog => blog.id !== id)
        await userDeleter.save()
        return response.status(200).json({ msg: "DELETED SUCCESFULLY" })
    } else {
        return response.status(400).send({ error: 'No Authorized' })
    }

})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    const result = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(result)
})

module.exports = blogRouter