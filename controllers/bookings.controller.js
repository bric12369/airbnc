const { fetchBookings } = require("../models/bookings.model")


const getBookings = async (req, res) => {
    const property_id = Number(req.params.id)
    const bookings = await fetchBookings(property_id)
    res.send({bookings, property_id})
}

module.exports = { getBookings }