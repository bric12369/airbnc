const { insertFavourite } = require("../models/favourites.model")

const postFavourite = async (req, res) => {
    const { id: property_id } = req.params
    const { guest_id } = req.body
    try {
        const favourite_id = await insertFavourite(property_id, guest_id)
        res.status(201).send({msg: 'Property favourited successfully', favourite_id})
    } catch (error) {
        console.log(error)
        res.send()
    }
}

module.exports = { postFavourite }