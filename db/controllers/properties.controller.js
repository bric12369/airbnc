const fetchAllProperties = require('../models/properties.model')

const getAllProperties = async (req, res) => {
    const { sort } = req.query
    const properties = await fetchAllProperties(sort)
    res.send({ properties })
}

module.exports = getAllProperties