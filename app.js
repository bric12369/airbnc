const express = require('express')
const {getAllProperties, getSingleProperty} = require('./controllers/properties.controller')
const {handleInvalidPath, handleBadRequest, handleCustomErrors} = require('./controllers/errors.controller')
const {getUserDetails, patchUserDetails} = require('./controllers/users.controller')
const {getPropertyReviews, postReview, deleteReview, getReviews, getSingleReview} = require('./controllers/reviews.controller')
const { postFavourite, deleteFavourite } = require('./controllers/favourites.controller')
const { getBookings, postBooking, deleteBooking, patchBooking } = require('./controllers/bookings.controller')
const { serveIndex } = require('./controllers/index.controller')

const app = express()
app.use(express.json())

app.get('/', serveIndex)

app.get('/api/properties', getAllProperties)

app.get('/api/properties/:id', getSingleProperty)

app.get('/api/properties/:id/reviews', getPropertyReviews)

app.get('/api/users/:id', getUserDetails)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:id', getSingleReview)

app.get('/api/properties/:id/bookings', getBookings)

app.post('/api/properties/:id/reviews', postReview)

app.post('/api/properties/:id/favourite', postFavourite)

app.post('/api/properties/:id/bookings', postBooking)

app.delete('/api/properties/:property_id/users/:user_id/favourite', deleteFavourite)

app.delete('/api/reviews/:id', deleteReview)

app.delete('/api/bookings/:id', deleteBooking)

app.patch('/api/users/:id', patchUserDetails)

app.patch('/api/bookings/:id', patchBooking)

app.all('/*invalid', handleInvalidPath)

app.use(handleBadRequest)
app.use(handleCustomErrors)

module.exports = app