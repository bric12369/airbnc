const { fetchAllProperties, fetchSingleProperty } = require('../models/properties.model')

const getAllProperties = async (req, res, next) => {
    const { sort, dir, max_price, min_price, property_type } = req.query
    try {
        const properties = await fetchAllProperties(sort, dir, max_price, min_price, property_type)
        res.send({ properties })
    } catch (error) {
        next(error)
    }
}

const getSingleProperty = async (req, res, next) => {
    const { id } = req.params
    const { user_id } = req.query
    try{
        const property = await fetchSingleProperty(id, user_id)
        res.send({ property })
    } catch (error) {
        next(error)
    }
}

module.exports = { getAllProperties, getSingleProperty }