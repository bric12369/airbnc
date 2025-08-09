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
    
    const values = [property_id, guest_id, check_in_date, check_out_date]
    
    const { rows } = await db.query(`
        INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, values)

    return rows[0].booking_id
}

module.exports = { fetchBookings, insertBooking }