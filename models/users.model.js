const db = require('../db/connection')


const fetchUser = async (id) => {

    const values = [id]

    const { rows } = await db.query(`SELECT user_id,
        first_name,
        surname,
        email,
        phone_number,
        avatar,
        created_at
        FROM users
        WHERE user_id = $1`, values)

    if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'User not found' })
    }
    return rows[0]
}

module.exports = { fetchUser }