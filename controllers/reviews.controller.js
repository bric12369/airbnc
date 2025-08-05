const { fetchSingleProperty } = require('../models/properties.model')
const { fetchPropertyReviews, insertReview, fetchReviews, removeReview } = require('../models/reviews.model')

const getPropertyReviews = async (req, res, next) => {
    const { id } = req.params
    try {
        await fetchSingleProperty(id)
        const reviews = await fetchPropertyReviews(id)
        const average_rating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
        res.send({ reviews, average_rating })
    }
    catch (error) {
        next(error)
    }
}

const postReview = async (req, res) => {
    const { guest_id, rating, comment } = req.body
    const { id } = req.params
    const review = await insertReview(guest_id, rating, comment, id)
    res.status(201).send({ review })
}

const getReviews = async (req, res) => {
    const reviews = await fetchReviews()
    res.send({ reviews })
}

const deleteReview = async (req, res) => {
    const { id } = req.params
    await removeReview(id)
    res.status(204).send()
}

module.exports = { postReview, getPropertyReviews, getReviews, deleteReview }