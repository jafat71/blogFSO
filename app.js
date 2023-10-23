require('express-async-errors')

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const {PORT,mongoUrl} = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login')

const middlewares = require('./utils/middlewares')

const blogURL = '/api/blogs'
const userURL = '/api/users'
const loginURL = '/api/auth/login'


mongoose.set('strictQuery', false)

logger.info('connecting to', mongoUrl)

mongoose.connect(mongoUrl)
    .then(() => logger.info("Connected to DB"))
    .catch(error => {
        logger.error("Error connecting to db: " + error)
        process.exit(1)
    })

app.use(cors())
app.use(express.json())
app.use(middlewares.tokenExtractor)

app.use(middlewares.requestLogger)

app.use(userURL,userRouter)
app.use(blogURL,middlewares.userExtractor, blogRouter)
app.use(loginURL,loginRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app