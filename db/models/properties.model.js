const db = require('../connection')

const fetchAllProperties = async (sort, dir, max_price, min_price) => {

    let orderClause = 'COUNT (favourites.favourite_id)'
    if (sort === 'price_per_night') orderClause = 'price_per_night'

    let directionClause = 'DESC'
    if (dir?.toUpperCase() === 'ASC') directionClause = 'ASC'

    let whereClause = ''
    const whereConditions = []
    if (max_price && !isNaN(max_price)) whereConditions.push(`price_per_night <= ${max_price}`)
    if (min_price && !isNaN(min_price)) whereConditions.push(`price_per_night >= ${min_price}`)
    if (whereConditions.length) whereClause = 'WHERE ' + whereConditions.join(' AND ')

    const { rows } = await db.query(
        `SELECT properties.property_id,
        name AS property_name,
        location,
        price_per_night,
        CONCAT(first_name, ' ', surname) AS host
        FROM properties
        JOIN users ON properties.host_id = users.user_id
        LEFT JOIN favourites ON properties.property_id = favourites.property_id
        ${whereClause}
        GROUP BY properties.property_id, name, location, price_per_night, users.first_name, users.surname
        ORDER BY ${orderClause} ${directionClause};`
    )
    return rows
}

module.exports = fetchAllProperties