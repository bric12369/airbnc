const db = require('./connection')
const formatJson = require('./utils/format-json')
const pgFormat = require('pg-format')
const { replaceHostNamesWithIds, sortKeysInPropertiesData } = require('./utils/format-properties-data')

async function seed(propertyTypesData, usersData, propertiesData) {
    await db.query(`DROP TABLE IF EXISTS properties`)
    await db.query(`DROP TABLE IF EXISTS property_types`)
    await db.query(`DROP TABLE IF EXISTS users`)

    await db.query(`CREATE TABLE property_types(
        property_type VARCHAR NOT NULL PRIMARY KEY,
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

    await db.query(`CREATE TABLE properties(
        property_id SERIAL PRIMARY KEY,
        host_id INT REFERENCES users(user_id) NOT NULL,
        name VARCHAR NOT NULL,
        location VARCHAR NOT NULL,
        property_type VARCHAR REFERENCES property_types(property_type) NOT NULL,
        price_per_night DECIMAL NOT NULL,
        description TEXT
        )`)

    const propertiesWithHostIds = replaceHostNamesWithIds(usersData, propertiesData)
    const sortedProperties = sortKeysInPropertiesData(propertiesWithHostIds)
    const finalFormattedProperties = formatJson(sortedProperties)

    await db.query(
        pgFormat(
            `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L`,
            finalFormattedProperties
        )
    )
}

module.exports = seed