const db = require('../db/connection')


const fetchUser = async (id) => {

    let values = []
    if (!isNaN(id)) values.push(id)

    const { rows } = await db.query(`SELECT user_id,
        first_name,
        surname,
        email,
        phone_number,
        avatar,
        created_at
        FROM users
        WHERE user_id = $1`, values)
    
    return rows[0]
}

module.exports = {fetchUser}