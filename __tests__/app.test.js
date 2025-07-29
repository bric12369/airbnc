const app = require('../app')
const request = require('supertest')
const { toBeOneOf } = require('jest-extended')
expect.extend({ toBeOneOf })
const db = require('../db/connection')
const seed = require('../db/seed')

beforeEach(() => {
    return seed()
})

afterAll(() => {
    db.end()
})

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
                    expect(body.properties[body.properties.length - 1].property_id).toBeOneOf([4, 11])
                })
                test('?sort=cost_per_night orders properties from highest cost_per_night to lowest', async () => {
                    const { body } = await request(app).get('/api/properties?sort=price_per_night')
                    expect(body.properties[0].property_id).toBe(6)
                    expect(body.properties[body.properties.length - 1].property_id).toBe(5)
                })
            })
            describe('dir', () => {
                test('?dir=asc inverts the default order of properties', async () => {
                    const { body } = await request(app).get('/api/properties?dir=asc')
                    expect(body.properties[0].property_id).toBeOneOf([4, 11])
                    expect(body.properties[body.properties.length - 1].property_id).toBe(2)
                })
                test('?dir=asc chains onto ?sort=cost_per_night to order from lowest to highest cost_per_night', async () => {
                    const { body } = await request(app).get('/api/properties?sort=price_per_night&dir=asc')
                    expect(body.properties[body.properties.length - 1].property_id).toBe(6)
                    expect(body.properties[0].property_id).toBe(5)
                })
            })
            describe('max_price', () => {
                test('?max_price limits returned properties by max price', async () => {
                    const { body } = await request(app).get('/api/properties?max_price=100')
                    body.properties.forEach((property) => {
                        expect(property.price_per_night <= 100).toBe(true)
                    })
                })
            })
            describe('min_price', () => {
                test('?min_price limits returned properties by min price', async () => {
                    const { body } = await request(app).get('/api/properties?min_price=100')
                    body.properties.forEach((property) => {
                        expect(property.price_per_night >= 100).toBe(true)
                    })
                })
            })
            describe('property_type', () => {
                test('?property_type returns only properties with matching property type', async () => {
                    const { body } = await request(app).get('/api/properties?property_type=house')
                    const resultIds = body.properties.map(({property_id}) => property_id)
                    expect(resultIds.length).toBe(3)
                    expect(resultIds).toEqual(expect.arrayContaining([2, 7, 10]))
                })
            })
        })
    })
    describe('GET /api/properties/:id', () => {
        test('get request to /api/properties/:id returns one property with matching property_id', async () => {
            const { body } = await request(app).get('/api/properties/3')
            expect(body.property.property_id).toBe(3)
        })
        test('get request to /api/properties/:id returns an array of single property with the following keys: property_id, property_name, location, price_per_night, description, host, host_avatar and favourite_count', async () => {
            const { body } = await request(app).get('/api/properties/3')
            const property = body.property
            expect(property.hasOwnProperty('property_id')).toBe(true)
            expect(property.hasOwnProperty('property_name')).toBe(true)
            expect(property.hasOwnProperty('location')).toBe(true)
            expect(property.hasOwnProperty('price_per_night')).toBe(true)
            expect(property.hasOwnProperty('description')).toBe(true)
            expect(property.hasOwnProperty('host')).toBe(true)
            expect(property.hasOwnProperty('host_avatar')).toBe(true)
            expect(property.hasOwnProperty('favourite_count')).toBe(true)
        })
    })
})