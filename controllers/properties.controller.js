const { fetchAllProperties, fetchSingleProperty } = require('../models/properties.model')

const getAllProperties = async (req, res) => {
    const { sort, dir, max_price, min_price, property_type } = req.query
    const properties = await fetchAllProperties(sort, dir, max_price, min_price, property_type)
    res.send({ properties })
}

const getSingleProperty = async (req, res) => {
    const { id } = req.params
    const { user_id } = req.query
    const property = await fetchSingleProperty(id, user_id)
    res.send({ property })
}

module.exports = { getAllProperties, getSingleProperty }