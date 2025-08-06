const db = require('../db/connection')

const insertFavourite = async (property_id, guest_id) => {

    const values = [property_id, guest_id]

    const { rows } = await db.query(`
        INSERT INTO favourites (property_id, guest_id) VALUES ($1, $2) RETURNING *
        `, values)
    
    return rows[0].favourite_id
}

module.exports = { insertFavourite }