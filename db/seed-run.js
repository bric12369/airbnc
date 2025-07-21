const seed = require('./seed')
const { formattedPropertyTypesData, formattedUsersData, finalFormattedProperties, finalFormattedReviews, finalFormattedImages, finalFormattedFavourites, finalFormattedBookings, uniqueAmenities, formattedPropertiesAmenitiesData } = require('./format-all-raw-data')

seed(formattedPropertyTypesData, formattedUsersData, finalFormattedProperties, finalFormattedReviews, finalFormattedImages, finalFormattedFavourites, finalFormattedBookings, uniqueAmenities, formattedPropertiesAmenitiesData)