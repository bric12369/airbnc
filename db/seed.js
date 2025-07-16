const db = require('./connection')
const formatJson = require('./utils/format-json')
const pgFormat = require('pg-format')

async function seed(propertyTypesData, usersData) {
    await db.query(`DROP TABLE IF EXISTS property_types`)
    await db.query(`DROP TABLE IF EXISTS users`)

    await db.query(`CREATE TABLE property_types(
        property_type VARCHAR NOT NULL,
        description TEXT NOT NULL
        )`)

    const formattedPropertyTypesData = formatJson(propertyTypesData)
    await db.query(
        pgFormat(
            `INSERT INTO property_types (property_type, description) VALUES %L`,
            formattedPropertyTypesData
        )
    )

    await db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        surname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone_number VARCHAR,
        is_host BOOLEAN NOT NULL,
        avatar VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
        )`)

    const formattedUsersData = formatJson(usersData)

    await db.query(
        pgFormat(
            `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L`,
            formattedUsersData
        )
    )
}

module.exports = seed