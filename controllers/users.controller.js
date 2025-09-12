const { fetchUser, updateUserDetails, fetchAllUsers } = require('../models/users.model')


const getUserDetails = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await fetchUser(id)
        res.send({user})
    } catch (error) {
        next(error)
    }
}

const patchUserDetails = async (req, res, next) => {
    const { id } = req.params
    const { first_name, surname, email, phone_number, avatar } = req.body
    try{
        const user = await updateUserDetails(id, first_name, surname, email, phone_number, avatar )
        res.send({user})
    } catch(error) {
        next(error)
    }
}

const getAllUsers = async (req, res) => {
    const users = await fetchAllUsers()
    res.send({users})
}

module.exports = {getUserDetails, getAllUsers, patchUserDetails}