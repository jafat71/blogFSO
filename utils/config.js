require('dotenv').config()

const PORT = process.env.PORT
const mongoUrl = process.env.MONGO_URI

module.exports = {
    PORT, 
    mongoUrl
}