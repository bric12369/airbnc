const express = require('express')
const getAllProperties = require('./controllers/properties.controller')

const app = express()

app.get('/api/properties',  getAllProperties)

module.exports = app