const seed = require('./seed')
const { propertyTypesData, usersData, propertiesData } = require('./data/test')

seed(propertyTypesData, usersData, propertiesData)