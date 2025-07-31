const { fetchUser } = require('../models/users.model')


const getUserDetails = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await fetchUser(id)
        res.send({user})
    } catch (error) {
        next(error)
    }
}

module.exports = getUserDetails