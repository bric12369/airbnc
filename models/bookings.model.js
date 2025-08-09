const db = require('../db/connection')

const fetchBookings = async (property_id) => {

    const { rows } = await db.query(`
        SELECT booking_id, 
        check_in_date, 
        check_out_date, 
        created_at
        FROM bookings
        WHERE property_id = $1
        `, [property_id])

    if (!rows.length) {
        return Promise.reject({ status: 200, msg: 'This property has no bookings at this time' })
    }

    return rows
}

const insertBooking = async (property_id, guest_id, check_in_date, check_out_date) => {

    const today = new Date()
    const checkIn = new Date(check_in_date)
    const checkOut = new Date(check_out_date)

    if (checkIn < today || checkOut < today) {
        return Promise.reject({ status: 400, msg: 'Bad request: check in/check out cannot be in the past' })
    }
    if (checkIn > checkOut) {
        return Promise.reject({ status: 400, msg: 'Bad request: check out must be after check in' })        
    }

    const values = [property_id, guest_id, check_in_date, check_out_date]

    const { rows } = await db.query(`
        INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, values)

    return rows[0].booking_id
}

module.exports = { fetchBookings, insertBooking }