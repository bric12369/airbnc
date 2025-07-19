const seed = require('./seed')
const { propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData, bookingsData } = require('./data/test')

seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData, bookingsData)