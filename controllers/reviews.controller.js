const { fetchPropertyReviews, insertReview } = require('../models/reviews.model')

const getPropertyReviews = async (req, res) => {
    const { id } = req.params
    const reviews = await fetchPropertyReviews(id)
    const average_rating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    res.send({ reviews, average_rating })
}

const postReview = async (req, res) => {
    const { guest_id, rating, comment} = req.body
    const { id } = req.params
    const review = await insertReview(guest_id, rating, comment, id)
    res.status(201).send({ review })
}

module.exports = {postReview, getPropertyReviews}