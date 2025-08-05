const { fetchSingleProperty } = require('../models/properties.model')
const { fetchPropertyReviews, insertReview, fetchReviews, removeReview, fetchSingleReview } = require('../models/reviews.model')

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

const postReview = async (req, res, next) => {
    const { guest_id, rating, comment } = req.body
    const { id } = req.params
    try {
        await fetchSingleProperty(id)
        const review = await insertReview(guest_id, rating, comment, id)
        res.status(201).send({ review })
    } catch (error) {
        next(error)
    }
}

const getReviews = async (req, res) => {
    const reviews = await fetchReviews()
    res.send({ reviews })
}

const deleteReview = async (req, res, next) => {
    const { id } = req.params
    try {
        await fetchSingleReview(id)
        await removeReview(id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

const getSingleReview = async (req, res, next) => {
    const { id } = req.params
    try {
        const review = await fetchSingleReview(id)
        res.send({review})
    } catch (error) {
        next(error)
    }
}

module.exports = { postReview, getPropertyReviews, getReviews, deleteReview, getSingleReview }