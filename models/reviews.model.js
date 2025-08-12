const db = require('../db/connection')

const fetchPropertyReviews = async (id) => {

    const values = [id]

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
    if (!rows.length) {
        return Promise.reject({ status: 200, msg: 'This property currently has no reviews available.' })
    }
    return rows
}

const insertReview = async (guest_id, rating, comment, id) => {

    const values = [id, guest_id, rating, comment]

    const query = `INSERT INTO reviews (property_id, guest_id, rating, comment)
    VALUES ($1, $2, $3, $4) RETURNING *`

    const { rows } = await db.query(query, values)
    return rows[0]
}

const fetchReviews = async () => {
    const { rows } = await db.query(`
        SELECT review_id,
        name as property_name,
        CONCAT(first_name, ' ', surname) as guest,
        rating,
        comment,
        reviews.created_at
        FROM reviews
        JOIN properties on reviews.property_id = properties.property_id
        JOIN users on reviews.guest_id = users.user_id;
        `)
    return rows
}

const removeReview = async (id) => {

    const values = [id]

    await db.query(
        `DELETE from reviews
        WHERE review_id = $1`,
        values
    )

    return
}

const fetchSingleReview = async (id) => {

    const values = [id]

        
        const {rows} = await db.query(`
            SELECT review_id,
            name as property_name,
            CONCAT(first_name, ' ', surname) as guest,
            rating,
            comment,
            reviews.created_at
            FROM reviews
            JOIN properties on reviews.property_id = properties.property_id
            JOIN users on reviews.guest_id = users.user_id
            WHERE review_id = $1;
            `, values)
            
    if (!rows.length) {
        return Promise.reject({status: 404, msg: 'Review not found'})
    }

    return rows[0]
}

module.exports = { fetchPropertyReviews, insertReview, fetchReviews, removeReview, fetchSingleReview }