const db = require('./connection')
const pgFormat = require('pg-format')
const {replacePeopleNamesWithIds, sortKeys, replacePropertyNamesWithIds, extractUniqueAmenities, formatPropertiesAmenitiesData } = require('./utils/format-raw-data')

async function seed(formattedPropertyTypesData, formattedUsersData, finalFormattedProperties, finalFormattedReviews, finalFormattedImages, finalFormattedFavourites, finalFormattedBookings, uniqueAmenities, formattedPropertiesAmenitiesData) {
    await db.query(`DROP TABLE IF EXISTS properties_amenities`)
    await db.query(`DROP TABLE IF EXISTS amenities`)
    await db.query(`DROP TABLE IF EXISTS bookings`)
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

    await db.query(
        pgFormat(
            `INSERT INTO favourites (guest_id, property_id) VALUES %L`,
            finalFormattedFavourites
        )
    )

    await db.query(`CREATE TABLE bookings(
        booking_id SERIAL PRIMARY KEY,
        property_id INT REFERENCES properties(property_id) NOT NULL,
        guest_id INT REFERENCES users(user_id) NOT NULL,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        )`)

    await db.query(
        pgFormat(
            `INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date) VALUES %L`,
            finalFormattedBookings
        )
    )

    await db.query(`CREATE TABLE amenities(
        amenity VARCHAR PRIMARY KEY
        )`)

    await db.query(`CREATE TABLE properties_amenities(
        property_amenity SERIAL PRIMARY KEY,
        property_id INT REFERENCES properties(property_id) NOT NULL,
        amenity_slug VARCHAR REFERENCES amenities(amenity) NOT NULL
        )`)

    await db.query(
        pgFormat(
            `INSERT INTO amenities (amenity) VALUES %L`,
            uniqueAmenities
        )
    )
    
    await db.query(
        pgFormat(
            `INSERT INTO properties_amenities (property_id, amenity_slug) VALUES %L`,
            formattedPropertiesAmenitiesData
        )
    )
}

module.exports = seed