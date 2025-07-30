const { fetchAllProperties, fetchSingleProperty, fetchPropertyReviews } = require('../models/properties.model')

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

const getPropertyReviews = async (req, res) => {
    const { id } = req.params
    const reviews = await fetchPropertyReviews(id)
    const average_rating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    res.send({ reviews, average_rating })
}

module.exports = { getAllProperties, getSingleProperty, getPropertyReviews }