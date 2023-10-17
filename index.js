const app = require('./app')
const {PORT,mongoUrl} = require('./utils/config')
const logger = require('./utils/logger')

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})