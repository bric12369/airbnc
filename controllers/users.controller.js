const { fetchUser } = require('../models/users.model')


const getUserDetails = async (req, res) => {
    const { id } = req.params
    const user = await fetchUser(id)
    res.send({user})
}

module.exports = getUserDetails