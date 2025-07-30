const db = require('../db/connection')

const fetchPropertyReviews = async (id) => {

    let values = []
    if (!isNaN(id)) values.push(id)

    let query = `SELECT review_id, 
    comment, 
    rating, 
    reviews.created_at, 
    CONCAT(first_name, ' ', surname) AS guest,
    avatar AS guest_avatar 
    FROM reviews 
    JOIN properties ON reviews.property_id = properties.property_id
    JOIN users ON reviews.guest_id = users.user_id
    WHERE properties.property_id = $1
    ORDER BY reviews.created_at;`

    const { rows } = await db.query(query, values)
    return rows
}

const insertReview = async (guest_id, rating, comment, id) => {

    let values = []
    if (!isNaN(id)) values.push(id)
    if (!isNaN(guest_id)) values.push(guest_id)
    if (!isNaN(rating)) values.push(rating)
    values.push(comment)

    const query = `INSERT INTO reviews (property_id, guest_id, rating, comment)
    VALUES ($1, $2, $3, $4) RETURNING *`

    const { rows } = await db.query(query, values)
    return rows[0]
}

module.exports = { fetchPropertyReviews, insertReview }