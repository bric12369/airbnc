const seed = require('./seed')
const { propertyTypesData, usersData, propertiesData, reviewsData, imagesData } = require('./data/test')

seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData)