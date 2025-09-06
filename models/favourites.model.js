const db = require('../db/connection')

const insertFavourite = async (property_id, guest_id) => {

    const values = [property_id, guest_id]

    const { rows } = await db.query(`
        INSERT INTO favourites (property_id, guest_id) VALUES ($1, $2) RETURNING *
        `, values)
    
    return rows[0].favourite_id
}

const removeFavourite = async (property_id, guest_id) => {

    const values = [property_id, guest_id]

    await db.query(`
        DELETE FROM favourites
        WHERE
        property_id = $1 AND
        guest_id = $2
        `, values)
    
    return
}

const fetchFavouritesByUser = async (id) => {

    const { rows } = await db.query(`
        SELECT favourites.favourite_id, 
        properties.name, 
        ARRAY_AGG(DISTINCT images.image_url) as images,
        properties.price_per_night, 
        properties.location, 
        properties.property_type, 
        properties.description 
        FROM favourites 
        JOIN properties on favourites.property_id = properties.property_id 
        LEFT JOIN images ON images.property_id = properties.property_id
        WHERE guest_id = $1
        GROUP BY 
        favourites.favourite_id,
        name, 
        price_per_night,
        location,
        property_type,
        description
        `, [id])
    
    if (!rows.length) {
        return Promise.reject({status: 200, msg: 'User currently has no favourited properties'})
    }

    return rows
}

module.exports = { insertFavourite, removeFavourite, fetchFavouritesByUser }