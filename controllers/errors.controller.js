
const handleInvalidPath = (req, res) => {
    res.status(404).send({ msg: 'Path not found' })
}

const handleBadRequest = (err, req, res, next) => {
    res.status(400).send({ msg: 'Bad request' })
}

module.exports = {handleInvalidPath, handleBadRequest}