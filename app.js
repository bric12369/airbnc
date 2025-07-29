const express = require('express')
const {getAllProperties, getSingleProperty} = require('./controllers/properties.controller')

const app = express()

app.get('/api/properties', getAllProperties)

app.get('/api/properties/:id', getSingleProperty)

module.exports = app