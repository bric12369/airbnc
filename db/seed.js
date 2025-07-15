const db = require('./connection')

async function seed() {
    await db.query(`DROP TABLE IF EXISTS property_types`)

    await db.query(`CREATE TABLE property_types(
        property_type VARCHAR NOT NULL,
        description TEXT NOT NULL
        )`)
    
    console.log('property_types created')
}

module.exports = seed