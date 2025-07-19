const db = require('./connection')
const formatJson = require('./utils/format-json')
const pgFormat = require('pg-format')
const { replacePeopleNamesWithIds } = require('./utils/format-properties-data')
const { replaceReviewNamesWithIds, sortKeys, replacePropertyNamesWithIds } = require('./utils/format-reviews-data')

async function seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData) {
    await db.query(`DROP TABLE IF EXISTS favourites`)
    await db.query(`DROP TABLE IF EXISTS images`)
    await db.query(`DROP TABLE IF EXISTS reviews`)
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

    const propertiesWithHostIds = replacePeopleNamesWithIds(usersData, propertiesData)
    const propertiesColumnOrder = ['host_id', 'name', 'location', 'property_type', 'price_per_night', 'description']
    const sortedProperties = sortKeys(propertiesWithHostIds, propertiesColumnOrder)
    const finalFormattedProperties = formatJson(sortedProperties)

    await db.query(
        pgFormat(
            `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L`,
            finalFormattedProperties
        )
    )

    await db.query(`CREATE TABLE reviews(
        review_id SERIAL PRIMARY KEY,
        property_id INT REFERENCES properties(property_id) NOT NULL,
        guest_id INT REFERENCES users(user_id) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
        )`)

    const updatedReviews = replaceReviewNamesWithIds(reviewsData, propertiesData, usersData)
    const reviewsColumnOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
    const sortedReviews = sortKeys(updatedReviews, reviewsColumnOrder)
    const finalFormattedReviews = formatJson(sortedReviews)

    await db.query(
        pgFormat(
            `INSERT INTO reviews (property_id, guest_id, rating, comment, created_at) VALUES %L`,
            finalFormattedReviews
        )
    )

    await db.query(`CREATE TABLE images(
        image_id SERIAL PRIMARY KEY,
        property_id INT REFERENCES properties(property_id) NOT NULL,
        image_url VARCHAR NOT NULL,
        alt_text VARCHAR NOT NULL
        )`)
    
    const updatedImages = replacePropertyNamesWithIds(imagesData, propertiesData)
    const imagesColumnOrder = ['property_id', 'image_url', 'alt_tag']
    const sortedImages = sortKeys(updatedImages, imagesColumnOrder)
    const finalFormattedImages = formatJson(sortedImages)

    await db.query(
        pgFormat(
            `INSERT INTO images (property_id, image_url, alt_text) VALUES %L`,
            finalFormattedImages
        )
    )
    
    await db.query(`CREATE TABLE favourites(
        favourite_id SERIAL PRIMARY KEY,
        guest_id INT REFERENCES users(user_id) NOT NULL,
        property_id INT REFERENCES properties(property_id) NOT NULL
        )`)
    
    const favouritesWithPropertyIds = replacePropertyNamesWithIds(favouritesData, propertiesData)
    const updatedFavourites = replacePeopleNamesWithIds(usersData, favouritesWithPropertyIds)
    const favouritesColumnOrder = ['guest_id', 'property_id']
    const sortedFavourites = sortKeys(updatedFavourites, favouritesColumnOrder)
    const finalFormattedFavourites = formatJson(sortedFavourites)

    await db.query(
        pgFormat(
            `INSERT INTO favourites (guest_id, property_id) VALUES %L`,
            finalFormattedFavourites
        )
    )
}

module.exports = seed