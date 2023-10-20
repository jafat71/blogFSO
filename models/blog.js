const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

//Sobreescribe el metodo
blogSchema.set('toJSON',{
    transform: (doc, returned)=>{
        returned.id = returned._id.toString()
        delete returned._id
        delete returned.__v
    }
})

module.exports = Blog