const { fetchBookings, insertBooking, removeBooking, updateBooking, checkBookingById } = require("../models/bookings.model")
const { fetchSingleProperty } = require("../models/properties.model")
const { fetchUser } = require("../models/users.model")


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

const postBooking = async (req, res, next) => {
    const { id } = req.params
    const { guest_id, check_in_date, check_out_date } = req.body
    try {
        if (id) await fetchSingleProperty(id)
        if (guest_id) await fetchUser(guest_id)
        const booking_id = await insertBooking(id, guest_id, check_in_date, check_out_date)
        res.status(201).send({booking_id, msg: 'Booking successful'})
    } catch (error) {
        next(error)
    }
}

const deleteBooking = async (req, res, next) => {
    const { id } = req.params
    try {
        await checkBookingById(id)
        await removeBooking(id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

const patchBooking = async (req, res, next) => {
    const { id } = req.params
    let { check_in_date, check_out_date } = req.body
    try {
        if (check_in_date === undefined && check_out_date === undefined) {
            return Promise.reject({status: 400, msg: 'Bad request: no fields provided to update'})
        }
        const originalBooking = await checkBookingById(id)
        if (!check_in_date) check_in_date = originalBooking.check_in_date
        if (!check_out_date) check_out_date = originalBooking.check_out_date
        const booking = await updateBooking(id, check_in_date, check_out_date)
        res.send({booking})
    } catch (error) {
        next(error)
    }
}

module.exports = { getBookings, postBooking, deleteBooking, patchBooking }