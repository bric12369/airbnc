const {replacePeopleNamesWithIds, sortKeys, replacePropertyNamesWithIds, extractUniqueAmenities, formatPropertiesAmenitiesData } = require('./utils/format-raw-data')

const formatJson = require('./utils/format-json')

let data = require('./data/dev') 
if (process.env.NODE_ENV === 'test') {
    data = require('./data/test') 
}

const { propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData, bookingsData } = data


const formattedPropertyTypesData = formatJson(propertyTypesData)


const formattedUsersData = formatJson(usersData)


const propertiesWithHostIds = replacePeopleNamesWithIds(usersData, propertiesData)
const propertiesColumnOrder = ['host_id', 'name', 'location', 'property_type', 'price_per_night', 'description']
const sortedProperties = sortKeys(propertiesWithHostIds, propertiesColumnOrder)
const finalFormattedProperties = formatJson(sortedProperties)


const reviewsWithpropertyIds = replacePropertyNamesWithIds(reviewsData, propertiesData)
const updatedReviews = replacePeopleNamesWithIds(usersData, reviewsWithpropertyIds)
const reviewsColumnOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
const sortedReviews = sortKeys(updatedReviews, reviewsColumnOrder)
const finalFormattedReviews = formatJson(sortedReviews)


const updatedImages = replacePropertyNamesWithIds(imagesData, propertiesData)
const imagesColumnOrder = ['property_id', 'image_url', 'alt_tag']
const sortedImages = sortKeys(updatedImages, imagesColumnOrder)
const finalFormattedImages = formatJson(sortedImages)


const favouritesWithPropertyIds = replacePropertyNamesWithIds(favouritesData, propertiesData)
const updatedFavourites = replacePeopleNamesWithIds(usersData, favouritesWithPropertyIds)
const favouritesColumnOrder = ['guest_id', 'property_id']
const sortedFavourites = sortKeys(updatedFavourites, favouritesColumnOrder)
const finalFormattedFavourites = formatJson(sortedFavourites)


const bookingsWithPropertyIds = replacePropertyNamesWithIds(bookingsData, propertiesData)
const updatedBookings = replacePeopleNamesWithIds(usersData, bookingsWithPropertyIds)
const bookingsColumnOrder = ['property_id', 'guest_id', 'check_in_date', 'check_out_date']
const sortedBookings = sortKeys(updatedBookings, bookingsColumnOrder)
const finalFormattedBookings = formatJson(sortedBookings)


const uniqueAmenities = extractUniqueAmenities(propertiesData)


const propertiesAmenitiesData = formatPropertiesAmenitiesData(propertiesData)
const formattedPropertiesAmenitiesData = formatJson(propertiesAmenitiesData)


module.exports = { formattedPropertyTypesData, formattedUsersData, finalFormattedProperties, finalFormattedReviews, finalFormattedImages, finalFormattedFavourites, finalFormattedBookings, uniqueAmenities, formattedPropertiesAmenitiesData }
