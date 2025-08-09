const { fetchBookings } = require("../models/bookings.model")
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

module.exports = { getBookings }