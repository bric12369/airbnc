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
        properties.property_id AS property_id,
        properties.name AS property_name, 
        image.image_url AS image,
        properties.price_per_night, 
        properties.location, 
        properties.property_type, 
        properties.description 
        FROM favourites 
        JOIN properties on favourites.property_id = properties.property_id 
        LEFT JOIN LATERAL (
        SELECT image_url 
        FROM images 
        WHERE images.property_id = properties.property_id 
        ORDER BY image_id
        LIMIT 1
        ) AS image on true
        WHERE guest_id = $1
        ORDER BY favourites.favourite_id
        `, [id])
    
    if (!rows.length) {
        return Promise.reject({status: 200, msg: 'User currently has no favourited properties'})
    }

    return rows
}

module.exports = { insertFavourite, removeFavourite, fetchFavouritesByUser }