const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)    
})

blogRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
        response.status(400).json({
            error: 'BAD REQUEST'
        })
    } 
    const blog = new Blog({...body,likes: body.likes || 0}) 
    const result = await blog.save()
    response.status(201).json(result)
            
})

blogRouter.delete('/:id',async (request,response) => {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.sendStatus(200)
})

blogRouter.put('/:id',async (request,response)=>{
    const id = request.params.id
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    const result = await Blog.findByIdAndUpdate(id,blog,{new:true})
    response.json(result)
})

module.exports = blogRouter