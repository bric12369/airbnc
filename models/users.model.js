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

const updateUserDetails = async (id, first_name, surname, email, phone_number, avatar) => {
    
    const possibleArgs = { first_name, surname, email, phone_number, avatar }
    const filteredArgs = Object.fromEntries(Object.entries(possibleArgs).filter(([_, value]) => value !== undefined))
    const values = [id]

    const setClauses = []

    for (const key in filteredArgs) {
        values.push(filteredArgs[key])
        setClauses.push(`${key} = $${values.length}`)
    }

    if (!setClauses.length) {
        return Promise.reject({status: 400, msg: 'Bad request: no fields provided to update'})
    }

    const { rows } = await db.query(`
        UPDATE users
        SET ${setClauses.join(', ')}
        WHERE user_id = $1
        RETURNING *
        `, values)
    return rows[0]
}

module.exports = { fetchUser, updateUserDetails }