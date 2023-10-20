require('express-async-errors')

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const {PORT,mongoUrl} = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const middlewares = require('./utils/middlewares')

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
app.use(middlewares.requestLogger)

app.use('/api/blogs',blogRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app