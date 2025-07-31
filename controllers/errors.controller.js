
const handleInvalidPath = (req, res) => {
    res.status(404).send({ msg: 'Path not found' })
}

const handleBadRequest = (err, req, res, next) => {
    if (err.code) {
        res.status(400).send({ msg: 'Bad request' })
    } else {
        next(err)
    }
}

const handleCustomErrors = async (err, req, res, next) => {
    
    res.status(err.status).send({msg: err.msg})
}

module.exports = {handleInvalidPath, handleBadRequest, handleCustomErrors}