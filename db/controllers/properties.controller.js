const fetchAllProperties = require('../models/properties.model')

const getAllProperties = async (req, res) => {
    const properties = await fetchAllProperties()
    res.send({ properties })
}

module.exports = getAllProperties