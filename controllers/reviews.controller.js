const { fetchPropertyReviews } = require('../models/reviews.model')

const getPropertyReviews = async (req, res) => {
    const { id } = req.params
    const reviews = await fetchPropertyReviews(id)
    const average_rating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    res.send({ reviews, average_rating })
}

const postReview = async (req, res) => {
    res.status(201).send()
}

module.exports = {postReview, getPropertyReviews}