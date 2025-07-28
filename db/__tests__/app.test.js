const app = require('../app')
const request = require('supertest')

describe('app', () => {
    describe('GET /api/properties', () => {
        test('get request to /api/properties returns status 200', async () => {
            await request(app).get('/api/properties').expect(200)
        })
        test('get request to /api/properties returns an object with an array of properties, each containing the following keys: property_id, property_name, location, price_per_night and host', async () => {
            const { body } = await request(app).get('/api/properties')
            expect(Array.isArray(body.properties)).toBe(true)
            expect(body.properties.length > 0).toBe(true)
            body.properties.forEach((property) => {
                expect(property.hasOwnProperty('property_id')).toBe(true)
                expect(property.hasOwnProperty('property_name')).toBe(true)
                expect(property.hasOwnProperty('location')).toBe(true)
                expect(property.hasOwnProperty('price_per_night')).toBe(true)
                expect(property.hasOwnProperty('host')).toBe(true)
            })
        })
        describe('Queries', () => {
            describe('sort', () => {
                test('properties are ordered from most favourited to least by default', async () => {
                    const { body } = await request(app).get('/api/properties')
                    expect(body.properties[0].property_id).toBe(2)
                    expect(body.properties[body.properties.length - 1].property_id).toBe(4)
                })
                test('?sort=cost_per_night orders properties from highest cost_per_night to lowest', async () => {
                    const { body } = await request(app).get('/api/properties?sort=price_per_night')
                    expect(body.properties[0].property_id).toBe(6)
                })
            })
        })
    })
})