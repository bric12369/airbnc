const fetchAllProperties = require('../models/properties.model')

const getAllProperties = async (req, res) => {
    const { sort, dir } = req.query
    const properties = await fetchAllProperties(sort, dir)
    res.send({ properties })
}

module.exports = getAllProperties