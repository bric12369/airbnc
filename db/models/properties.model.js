const db = require('../connection')

const fetchAllProperties = async (sort) => {

    let orderClause = 'COUNT (favourites.favourite_id)'
    if (sort === 'price_per_night') orderClause = 'price_per_night'

    const { rows } = await db.query(
        `SELECT properties.property_id,
        name AS property_name,
        location,
        price_per_night,
        CONCAT(first_name, ' ', surname) AS host
        FROM properties
        JOIN users ON properties.host_id = users.user_id
        LEFT JOIN favourites ON properties.property_id = favourites.property_id
        GROUP BY properties.property_id, name, location, price_per_night, users.first_name, users.surname
        ORDER BY ${orderClause} DESC;`
    )
    return rows
}

module.exports = fetchAllProperties