const express = require('express')
const {getAllProperties, getSingleProperty, getPropertyReviews} = require('./controllers/properties.controller')
const handleInvalidPath = require('./controllers/errors.controller')
const getUserDetails = require('./controllers/users.controller')
const postReview = require('./controllers/reviews.controller')

const app = express()

app.get('/api/properties', getAllProperties)

app.get('/api/properties/:id', getSingleProperty)

app.get('/api/properties/:id/reviews', getPropertyReviews)

app.get('/api/users/:id', getUserDetails)

app.post('/api/properties/:id/reviews', postReview)

app.all('/*invalid', handleInvalidPath)

module.exports = app