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

const fetchBookingsByUserId = async (user_id) => {

    const { rows } = await db.query(`
        SELECT booking_id,
        check_in_date,
        check_out_date,
        properties.property_id,
        name AS property_name,
        CONCAT(first_name, ' ', surname) AS host,
        images.image_url AS image
        FROM bookings
        JOIN properties ON properties.property_id = bookings.property_id
        JOIN users ON users.user_id = properties.host_id
        JOIN LATERAL(
            SELECT image_url
            FROM
            images
            WHERE images.property_id = bookings.property_id
            LIMIT 1
        ) images ON true
        WHERE guest_id = $1
        ORDER BY check_in_date;
        `, [user_id])

    return rows
}

const insertBooking = async (property_id, guest_id, check_in_date, check_out_date) => {

    await checkValidDates(check_in_date, check_out_date)

    const values = [property_id, guest_id, check_in_date, check_out_date]

    const { rows } = await db.query(`
        INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, values)

    return rows[0].booking_id
}

const removeBooking = async (booking_id) => {

    await db.query(`
        DELETE FROM bookings 
        WHERE booking_id = $1
        `, [booking_id])
    
    return
}

const checkBookingById = async (booking_id) => {

    const { rows: bookings } = await db.query(`
        SELECT * FROM bookings
        WHERE booking_id = $1
        `, [booking_id])
    
    if (!bookings.length) {
        return Promise.reject({status: 404, msg: 'Booking not found'})
    }

    return bookings[0]
}

const updateBooking = async (booking_id, check_in_date, check_out_date) =>{

    await checkValidDates(check_in_date, check_out_date)

    const values = [booking_id]
    const setClauses = []

    if (check_in_date) {
        values.push(check_in_date)
        setClauses.push(`check_in_date = $${values.length}`)
    }
    if (check_out_date) {
        values.push(check_out_date)
        setClauses.push(`check_out_date = $${values.length}`)
    }

    const { rows } = await db.query(`
        UPDATE bookings
        SET ${setClauses.join(', ')}
        WHERE booking_id = $1
        RETURNING *
        `, values)
    
    return rows[0]
}

const checkValidDates = (check_in_date, check_out_date) => {
    
    const today = new Date()
    const checkIn = new Date(check_in_date)
    const checkOut = new Date(check_out_date)

    if (checkIn < today || checkOut < today) {
        return Promise.reject({ status: 400, msg: 'Bad request: check in/check out cannot be in the past' })
    }
    if (checkIn > checkOut) {
        return Promise.reject({ status: 400, msg: 'Bad request: check out must be after check in' })        
    }
}

module.exports = { fetchBookings, fetchBookingsByUserId, insertBooking, removeBooking, updateBooking, checkBookingById }