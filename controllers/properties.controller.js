const { fetchAllProperties, fetchSingleProperty } = require('../models/properties.model')
const { fetchUser } = require('../models/users.model')

const getAllProperties = async (req, res, next) => {
    const { sort, dir, max_price, min_price, property_type, host_id } = req.query
    try {
        if (host_id) await fetchUser(host_id)
        const properties = await fetchAllProperties(sort, dir, max_price, min_price, property_type, host_id)
        res.send({ properties })
    } catch (error) {
        next(error)
    }
}

const getSingleProperty = async (req, res, next) => {
    const { id } = req.params
    const { user_id } = req.query
    try{
        if (user_id) await fetchUser(user_id)
        const property = await fetchSingleProperty(id, user_id)
        res.send({ property })
    } catch (error) {
        next(error)
    }
}

module.exports = { getAllProperties, getSingleProperty }