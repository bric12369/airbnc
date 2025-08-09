
const handleInvalidPath = (req, res) => {
    res.status(404).send({ msg: 'Path not found' })
}

const handleBadRequest = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '22007') {
        res.status(400).send({ msg: 'Bad request: invalid data type' })
    } else if (err.code === '23502') {
        res.status(400).send({ msg: 'Bad request: Please provide all required values' })
    } else if (err.code === '22008') {
        res.status(400).send({msg: 'Bad request: invalid date provided'})
    } else {
        next(err)
    }
}

const handleCustomErrors = async (err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg })
}

module.exports = { handleInvalidPath, handleBadRequest, handleCustomErrors }