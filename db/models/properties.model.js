const db = require('../connection')

const fetchAllProperties = async (sort, dir) => {

    let orderClause = 'COUNT (favourites.favourite_id)'
    if (sort === 'price_per_night') orderClause = 'price_per_night'

    let directionClause = 'DESC'
    if (dir?.toUpperCase() === 'ASC') directionClause = 'ASC'

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
        ORDER BY ${orderClause} ${directionClause};`
    )
    return rows
}

module.exports = fetchAllProperties