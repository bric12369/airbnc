const db = require('./connection')
const formatJson = require('./utils/format-json')
const pgFormat = require('pg-format')

async function seed(propertyTypesData) {
    await db.query(`DROP TABLE IF EXISTS property_types`)

    await db.query(`CREATE TABLE property_types(
        property_type VARCHAR NOT NULL,
        description TEXT NOT NULL
        )`)

    const formattedPropertyTypesData = formatJson(propertyTypesData)
    await db.query(
        pgFormat(
            `INSERT INTO property_types (property_type, description) 
            VALUES %L`,
            formattedPropertyTypesData
        )
    )
}

module.exports = seed