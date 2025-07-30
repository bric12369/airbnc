const express = require('express')
const {getAllProperties, getSingleProperty, getPropertyReviews} = require('./controllers/properties.controller')

const app = express()

app.get('/api/properties', getAllProperties)

app.get('/api/properties/:id', getSingleProperty)

app.get('/api/properties/:id/reviews', getPropertyReviews)

module.exports = app