const { fetchBookings, insertBooking } = require("../models/bookings.model")
const { fetchSingleProperty } = require("../models/properties.model")


const getBookings = async (req, res, next) => {
    const { id } = req.params
    try {
        await fetchSingleProperty(id)
        const bookings = await fetchBookings(id)
        const property_id = Number(id)
        res.send({bookings, property_id})
    } catch (error) {
        next(error)
    }
}

const postBooking = async (req, res) => {
    const { id } = req.params
    const { guest_id, check_in_date, check_out_date } = req.body
    const booking_id = await insertBooking(id, guest_id, check_in_date, check_out_date)
    res.status(201).send({booking_id, msg: 'Booking successful'})
}

module.exports = { getBookings, postBooking }