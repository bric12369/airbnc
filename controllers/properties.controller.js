const fetchAllProperties = require('../models/properties.model')

const getAllProperties = async (req, res) => {
    const { sort, dir, max_price, min_price, property_type } = req.query
    const properties = await fetchAllProperties(sort, dir, max_price, min_price, property_type)
    res.send({ properties })
}

module.exports = getAllProperties