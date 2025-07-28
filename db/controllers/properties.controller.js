const fetchAllProperties = require('../models/properties.model')

const getAllProperties = async (req, res) => {
    const { sort, dir, max_price } = req.query
    const properties = await fetchAllProperties(sort, dir, max_price)
    res.send({ properties })
}

module.exports = getAllProperties