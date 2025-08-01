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
    test('request to an invalid endpoint responds with 404 and a msg', async () => {
        const { body } = await request(app).get('/invalid-path').expect(404)
        expect(body.msg).toBe('Path not found')
    })
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
                test('returns status 400 with msg Bad request when max_price is not a number', async () => {
                    const { body } = await request(app).get('/api/properties?max_price=not_a_number').expect(400)
                    expect(body.msg).toBe('Bad request')
                })
                test('returns status 404 with msg properties not found when max_price is a valid number, but lower than the lowest cost_per_night', async () => {
                    const { body } = await request(app).get('/api/properties?max_price=1').expect(404)
                    expect(body.msg).toBe('Properties not found')
                })
            })
            describe('min_price', () => {
                test('?min_price limits returned properties by min price', async () => {
                    const { body } = await request(app).get('/api/properties?min_price=100')
                    body.properties.forEach((property) => {
                        expect(property.price_per_night >= 100).toBe(true)
                    })
                })
                test('returns status 400 with msg Bad request when min_price is not a number', async () => {
                    const { body } = await request(app).get('/api/properties?min_price=not_a_number').expect(400)
                    expect(body.msg).toBe('Bad request')
                })
            })
            describe('property_type', () => {
                test('?property_type returns only properties with matching property type', async () => {
                    const { body } = await request(app).get('/api/properties?property_type=house')
                    const resultIds = body.properties.map(({ property_id }) => property_id)
                    expect(resultIds.length).toBe(3)
                    expect(resultIds).toEqual(expect.arrayContaining([2, 7, 10]))
                })
                test('returns status 404 and msg when passed a property type which does not exist', async () => {
                    const { body } = await request(app).get('/api/properties?property_type=non-existent-property-type')
                    expect(404)
                    expect(body.msg).toBe('Properties not found')
                })
            })
        })
    })

    describe('GET /api/properties/:id', () => {
        test('get request to /api/properties/:id returns status code 200', async () => {
            await request(app).get('/api/properties/3').expect(200)
        })
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
        test('returns 404 and msg when passed an id which does not exist', async () => {
            const { body } = await request(app).get('/api/properties/1000').expect(404)
            expect(body.msg).toBe('Property not found')
        })
        test('returns 400 and msg when passed invalid data type', async () => {
            const { body } = await request(app).get('/api/properties/not-a-number').expect(400)
            expect(body.msg).toBe('Bad request')
        })
        describe('Queries', () => {
            describe('user_id', () => {
                test('?user_id adds another property, favourited, which is a boolean value representing whether the corresponding user has favourited that property', async () => {
                    const { body } = await request(app).get('/api/properties/3?user_id=1')
                    const property = body.property
                    expect(typeof property.favourited).toBe('boolean')
                    expect(property.favourited).toBe(false)
                    const { body: body2 } = await request(app).get('/api/properties/3?user_id=6')
                    const property2 = body2.property
                    expect(property2.favourited).toBe(true)
                })
                test('returns 404 and msg when passed a user_id which does not exist', async () => {
                    const { body } = await request(app).get('/api/properties/3?user_id=1000').expect(404)
                    expect(body.msg).toBe('User not found')
                })
                test('returns 400 and msg when passed invalid data type', async () => {
                    const { body } = await request(app).get('/api/properties/3?user_id=not-a-number').expect(400)
                    expect(body.msg).toBe('Bad request')
                })
            })
        })
    })

    describe('GET /api/properties/:id/reviews', () => {
        test('get request to /api/properties/:id/reviews returns status 200', async () => {
            await request(app).get('/api/properties/3/reviews').expect(200)
        })
        test('get request to /api/properties/:id/reviews returns an array of reviews related to the corresponding property id, each with keys: review_id, comment, rating, created_at, guest, guest_avatar', async () => {
            const { body } = await request(app).get('/api/properties/3/reviews').expect(200)
            expect(body.reviews.length).toBe(3)
            body.reviews.forEach((review) => {
                expect(review.hasOwnProperty('review_id')).toBe(true)
                expect(review.hasOwnProperty('comment')).toBe(true)
                expect(review.hasOwnProperty('rating')).toBe(true)
                expect(review.hasOwnProperty('created_at')).toBe(true)
                expect(review.hasOwnProperty('guest')).toBe(true)
                expect(review.hasOwnProperty('guest_avatar')).toBe(true)
            })
        })
        test('get request to /api/properties/:id/reviews also returns an average_rating property which calculates the average rating of body.reviews', async () => {
            const { body } = await request(app).get('/api/properties/3/reviews')
            expect(body.average_rating).toBe(4)
        })
    })

    describe('GET /api/users/:id', () => {
        test('get request to /api/users/:id returns status 200', async () => {
            await request(app).get('/api/users/3').expect(200)
        })
        test('get request to /api/users/:id returns single user with the following properties: user_id, first_name, surname, email, phone_number, avatar, created_at', async () => {
            const { body } = await request(app).get('/api/users/3')
            const { user } = body
            expect(user.hasOwnProperty('user_id')).toBe(true)
            expect(user.hasOwnProperty('first_name')).toBe(true)
            expect(user.hasOwnProperty('surname')).toBe(true)
            expect(user.hasOwnProperty('email')).toBe(true)
            expect(user.hasOwnProperty('phone_number')).toBe(true)
            expect(user.hasOwnProperty('avatar')).toBe(true)
            expect(user.hasOwnProperty('created_at')).toBe(true)
        })
        test('returns 404 and msg when passed a user_id which does not exist', async () => {
            const { body } = await request(app).get('/api/users/1000').expect(404)
            expect(body.msg).toBe('User not found')
        })
        test('returns 400 and msg when passed invalid data type', async () => {
            const { body } = await request(app).get('/api/users/not-a-number').expect(400)
            expect(body.msg).toBe('Bad request')
        })
    })

    describe('POST /api/properties/:id/reviews', () => {
        test('successful post to /api/properties/:id/reviews adds new review to db and returns status 201', async () => {
            await request(app).post('/api/properties/3/reviews').send({
                "guest_id": 2,
                "rating": 5,
                "comment": 'Great'
            }).expect(201)
            const { body } = await request(app).get('/api/properties/3/reviews')
            expect(body.reviews.length).toBe(4)
        })
        test('successful post to /api/properties/:id/reviews returns inserted review with the following keys: review_id, property_id, guest_id, rating, comment, created_at', async () => {
            const { body } = await request(app).post('/api/properties/3/reviews').send({
                "guest_id": 2,
                "rating": 5,
                "comment": 'Great'
            })
            const { review } = body
            expect(review.review_id).toBe(17)
            expect(review.property_id).toBe(3)
            expect(review.guest_id).toBe(2)
            expect(review.rating).toBe(5)
            expect(review.comment).toBe('Great')
            expect(review.hasOwnProperty('created_at')).toBe(true)
        })
    })

    describe('GET /api/reviews', () => {
        test('get request to /api/reviews returns status code 200 and array of reviews with following keys: review_id, property_name, guest, rating, comment, created_at', async () => {
            const { body } = await request(app).get('/api/reviews').expect(200)
            body.reviews.forEach((review) => {
                expect(review.hasOwnProperty('review_id')).toBe(true)
                expect(review.hasOwnProperty('property_name')).toBe(true)
                expect(review.hasOwnProperty('guest')).toBe(true)
                expect(review.hasOwnProperty('rating')).toBe(true)
                expect(review.hasOwnProperty('comment')).toBe(true)
                expect(review.hasOwnProperty('created_at')).toBe(true)
            })
        })
    })

    describe('DELETE /api/reviews/:id', () => {
        test('successful delete request to /api/reviews/:id returns status code 204 and deletes corresponding review from reviews table', async () => {
            const { body } = await request(app).get('/api/reviews')
            expect(body.reviews.some(review => review.review_id === 3)).toBe(true)
            await request(app).delete('/api/reviews/3').expect(204)
            const { body: afterDelete } = await request(app).get('/api/reviews')
            expect(afterDelete.reviews.some(review => review.review_id === 3)).toBe(false)
        })
    })
})