const db = require('../db/connection')

const fetchAllProperties = async (sort, dir, max_price, min_price, property_type, host_id) => {
    const validSort = ['price_per_night', 'popularity']
    const validDir = ['ASC', 'DESC']
    let msg
    
    if (sort && !validSort.includes(sort)) {
        msg = `Invalid value "${sort}" provided for sort. Default sort returned.`
    } else if (dir && !validDir.includes(dir.toUpperCase())) {
        msg = `Invalid value "${dir}" provided for dir. Default dir returned.`
    }
    
    const orderClause = sort === 'price_per_night' ? 'price_per_night' : 'COUNT (favourites.favourite_id)'

    const directionClause = dir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    let whereClause = ''
    const whereConditions = []

    const values = []
    if (max_price) {
        values.push(max_price)
        whereConditions.push(`price_per_night <= $${values.length}`)
    }
    if (min_price) {
        values.push(min_price)
        whereConditions.push(`price_per_night >= $${values.length}`)
    }
    if (property_type) {
        values.push(property_type[0].toUpperCase() + property_type.substring(1).toLowerCase())
        whereConditions.push(`property_type = $${values.length}`)
    }
    if (host_id) {
        values.push(host_id)
        whereConditions.push(`host_id = $${values.length}`)
    }
    if (whereConditions.length) whereClause = 'WHERE ' + whereConditions.join(' AND ')

    const { rows } = await db.query(
        `SELECT properties.property_id,
        name AS property_name,
        location,
        price_per_night,
        CONCAT(first_name, ' ', surname) AS host,
        img.image_url AS image
        FROM properties
        JOIN users ON properties.host_id = users.user_id
        LEFT JOIN favourites ON properties.property_id = favourites.property_id
        LEFT JOIN Lateral (
            SELECT image_url
            FROM images
            WHERE images.property_id = properties.property_id
            ORDER BY image_id
            LIMIT 1
        ) img ON true
        ${whereClause}
        GROUP BY properties.property_id, name, location, price_per_night, users.first_name, users.surname, img.image_url
        ORDER BY ${orderClause} ${directionClause};`, values
    )
    
    if (!rows.length) {
        if (host_id) {
            return Promise.reject({status: 200, msg: 'This user currently has no properties'})
        } else {
            return Promise.reject({status: 200, msg: 'Properties not found'})
        }
    }
    
    return {rows, msg}
}

const fetchSingleProperty = async (id, user_id) => {

    let values = []
    if (id) values.push(id)
    if (user_id) values.push(user_id)

    let query = `SELECT properties.property_id,
        name AS property_name,
        location,
        price_per_night,
        description,
        CONCAT(first_name, ' ', surname) AS host,
        users.avatar AS host_avatar,
        COUNT(favourite_id) AS favourite_count`

    if (values.includes(user_id)) {
        query += `, BOOL_OR(favourites.guest_id = $2) as favourited`
    }

    query += `, ARRAY_AGG(DISTINCT images.image_url) as images
        FROM properties
        JOIN users ON properties.host_id = users.user_id
        LEFT JOIN favourites ON properties.property_id = favourites.property_id
        LEFT JOIN images on images.property_id = properties.property_id
        WHERE properties.property_id = $1
        GROUP BY properties.property_id, name, location, price_per_night, description, users.first_name, users.surname, users.avatar;`

    const { rows } = await db.query(query, values)
    if (!rows.length) {
        return Promise.reject({status: 404, msg: 'Property not found'})
    }
    return rows[0]
}

module.exports = { fetchAllProperties, fetchSingleProperty }