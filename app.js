const express = require('express')
const {getAllProperties, getSingleProperty} = require('./controllers/properties.controller')
const {handleInvalidPath, handleBadRequest, handleCustomErrors} = require('./controllers/errors.controller')
const getUserDetails = require('./controllers/users.controller')
const {getPropertyReviews, postReview, deleteReview, getReviews} = require('./controllers/reviews.controller')

const app = express()
app.use(express.json())

app.get('/api/properties', getAllProperties)

app.get('/api/properties/:id', getSingleProperty)

app.get('/api/properties/:id/reviews', getPropertyReviews)

app.get('/api/users/:id', getUserDetails)

app.post('/api/properties/:id/reviews', postReview)

app.get('/api/reviews', getReviews)

app.delete('/api/reviews/:id', deleteReview)

app.all('/*invalid', handleInvalidPath)

app.use(handleBadRequest)
app.use(handleCustomErrors)

module.exports = app