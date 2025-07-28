const db = require('../connection')

const fetchAllProperties = async () => {
    const { rows } = await db.query(
        `SELECT property_id,
        name AS property_name,
        location,
        price_per_night,
        CONCAT(first_name, ' ', surname) AS host
        FROM properties
        JOIN users on properties.host_id = users.user_id;`
    )
    return rows
}

module.exports = fetchAllProperties