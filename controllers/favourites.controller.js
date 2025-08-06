const { insertFavourite } = require("../models/favourites.model")
const { fetchSingleProperty } = require("../models/properties.model")
const { fetchUser } = require("../models/users.model")

const postFavourite = async (req, res, next) => {
    const { id: property_id } = req.params
    const { guest_id } = req.body
    try {
        await fetchSingleProperty(property_id)
        if (guest_id) await fetchUser(guest_id)
        const favourite_id = await insertFavourite(property_id, guest_id)
        res.status(201).send({msg: 'Property favourited successfully', favourite_id})
    } catch (error) {
        next(error)
    }
}

module.exports = { postFavourite }