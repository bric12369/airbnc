const db = require('./connection')
const pgFormat = require('pg-format')
const { formattedPropertyTypesData, formattedUsersData, finalFormattedProperties, finalFormattedReviews, finalFormattedImages, finalFormattedFavourites, finalFormattedBookings, uniqueAmenities, formattedPropertiesAmenitiesData } = require('./format-all-raw-data')

async function insertAllData() {
    await db.query(
        pgFormat(
            `INSERT INTO property_types (property_type, description) VALUES %L`,
            formattedPropertyTypesData
        )
    )

    await db.query(
        pgFormat(
            `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L`,
            formattedUsersData
        )
    )

    await db.query(
        pgFormat(
            `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L`,
            finalFormattedProperties
        )
    )

    await db.query(
        pgFormat(
            `INSERT INTO reviews (property_id, guest_id, rating, comment, created_at) VALUES %L`,
            finalFormattedReviews
        )
    )

    await db.query(
        pgFormat(
            `INSERT INTO images (property_id, image_url, alt_text) VALUES %L`,
            finalFormattedImages
        )
    )
    
    await db.query(
        pgFormat(
            `INSERT INTO favourites (guest_id, property_id) VALUES %L`,
            finalFormattedFavourites
        )
    )

    await db.query(
        pgFormat(
            `INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date) VALUES %L`,
            finalFormattedBookings
        )
    )

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

module.exports = insertAllData