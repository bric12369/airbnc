const path = require('path')

const serveIndex = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '../index.html'))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = { serveIndex }