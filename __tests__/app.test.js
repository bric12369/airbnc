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
        test('each property has an image field equal to the first image associated with that property', async () => {
            const { body } = await request(app).get('/api/properties')
            const property1 = body.properties.find(property => property.property_id === 1)
            expect(property1.image).toBe('https://example.com/images/modern_apartment_1.jpg')
            const property2 = body.properties.find(property => property.property_id === 2)
            expect(property2.image).toBe('https://example.com/images/cosy_family_house_1.jpg')
        })
        describe('Queries', () => {
            describe('sort', () => {
                test('properties are ordered from most favourited to least by default', async () => {
                    const { body } = await request(app).get('/api/properties')
                    expect(body.properties[0].property_id).toBe(2)
                    expect(body.properties[body.properties.length - 1].property_id).toBeOneOf([4, 11])
                })
                test('?sort=price_per_night orders properties from highest cost_per_night to lowest', async () => {
                    const { body } = await request(app).get('/api/properties?sort=price_per_night').expect(200)
                    expect(body.properties[0].property_id).toBe(6)
                    expect(body.properties[body.properties.length - 1].property_id).toBe(5)
                })
            })
            describe('dir', () => {
                test('?dir=asc inverts the default order of properties', async () => {
                    const { body } = await request(app).get('/api/properties?dir=asc').expect(200)
                    expect(body.properties[0].property_id).toBeOneOf([4, 11])
                    expect(body.properties[body.properties.length - 1].property_id).toBe(2)
                })
                test('dir only accepts asc/ASC, otherwise results are ordered desc by default', async () => {
                    const { body } = await request(app).get('/api/properties?dir=not-asc')
                    expect(body.properties[0].property_id).toBe(2)
                    expect(body.properties[body.properties.length - 1].property_id).toBeOneOf([4, 11])
                })
                test('?dir=asc chains onto ?sort=cost_per_night to order from lowest to highest cost_per_night', async () => {
                    const { body } = await request(app).get('/api/properties?sort=price_per_night&dir=asc').expect(200)
                    expect(body.properties[body.properties.length - 1].property_id).toBe(6)
                    expect(body.properties[0].property_id).toBe(5)
                })
            })
            describe('max_price', () => {
                test('?max_price limits returned properties by max price', async () => {
                    const { body } = await request(app).get('/api/properties?max_price=100').expect(200)
                    body.properties.forEach((property) => {
                        expect(property.price_per_night <= 100).toBe(true)
                    })
                })
                test('returns status 400 with msg Bad request when max_price is not a number', async () => {
                    const { body } = await request(app).get('/api/properties?max_price=not_a_number').expect(400)
                    expect(body.msg).toBe('Bad request: invalid data type')
                })
                test('returns status 404 with msg properties not found when max_price is a valid number, but lower than the lowest cost_per_night', async () => {
                    const { body } = await request(app).get('/api/properties?max_price=1').expect(404)
                    expect(body.msg).toBe('Properties not found')
                })
            })
            describe('min_price', () => {
                test('?min_price limits returned properties by min price', async () => {
                    const { body } = await request(app).get('/api/properties?min_price=100').expect(200)
                    body.properties.forEach((property) => {
                        expect(property.price_per_night >= 100).toBe(true)
                    })
                })
                test('returns status 400 with msg Bad request when min_price is not a number', async () => {
                    const { body } = await request(app).get('/api/properties?min_price=not_a_number').expect(400)
                    expect(body.msg).toBe('Bad request: invalid data type')
                })
            })
            describe('property_type', () => {
                test('?property_type returns only properties with matching property type', async () => {
                    const { body } = await request(app).get('/api/properties?property_type=house').expect(200)
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
            describe('host_id', () => {
                test('?host_id returns only the properties with matching host id', async () => {
                    const { body } = await request(app).get('/api/properties?host_id=1').expect(200)
                    body.properties.forEach((property) => {
                        expect(property.host).toBe('Alice Johnson')
                    })
                })
                test('returns 400 when host id is invalid', async () => {
                    const { body } = await request(app).get('/api/properties?host_id=not-a-number').expect(400)
                    expect(body.msg).toBe('Bad request: invalid data type')
                })
                test('returns 404 when host id does not exist', async () => {
                    const { body } = await request(app).get('/api/properties?host_id=1000').expect(404)
                    expect(body.msg).toBe('User not found')
                })
                test('returns 200 when host id valid and exists but no properties associated', async () => {
                    const { body } = await request(app).get('/api/properties?host_id=2').expect(200)
                    expect(body.msg).toBe('This user currently has no properties')
                })
            })
        })
        describe('Queries: Combinations', () => {
            test('returns properties filtered by type, min and max prices', async () => {
                const { body: houses } = await request(app).get('/api/properties?property_type=house&min_price=150&max_price=180').expect(200)
                houses.properties.forEach((property) => {
                    expect(property.property_name).toBeOneOf(['Cosy Family House', 'Quaint Cottage in the Hills'])
                    expect(property.price_per_night >= 150 && property.price_per_night <= 180).toBe(true)
                })
                const { body: apartments } = await request(app).get('/api/properties?min_price=130&property_type=apartment&max_price=200').expect(200)
                expect(apartments.properties.length).toBe(1)
                expect(apartments.properties[0].price_per_night >= 130 &&
                    apartments.properties[0].price_per_night <= 200
                ).toBe(true)
            })
            test('returns properties filtered by type, min and max prices and orders by cost', async () => {
                const { body: houses } = await request(app).get('/api/properties?property_type=house&min_price=150&max_price=180&sort=price_per_night').expect(200)
                expect(houses.properties[0].property_name).toBe('Quaint Cottage in the Hills')
                expect(houses.properties[1].property_name).toBe('Cosy Family House')
            })
            test('returns properties filtered by type, min and max prices and orders by cost in ascending order', async () => {
                const { body: houses } = await request(app).get('/api/properties?property_type=house&min_price=150&max_price=180&sort=price_per_night&dir=asc').expect(200)
                expect(houses.properties[0].property_name).toBe('Cosy Family House')
                expect(houses.properties[1].property_name).toBe('Quaint Cottage in the Hills')
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
        test('property has an image property equal to an array of all associated images', async () => {
            const { body } = await request(app).get('/api/properties/1')
            expect(body.property.images.length).toBe(3)
            expect(Array.isArray(body.property.images)).toBe(true)
            const { body: body2 } = await request(app).get('/api/properties/2')
            expect(body2.property.images.length).toBe(1)
        })
        test('returns 404 and msg when passed an id which does not exist', async () => {
            const { body } = await request(app).get('/api/properties/1000').expect(404)
            expect(body.msg).toBe('Property not found')
        })
        test('returns 400 and msg when passed invalid data type', async () => {
            const { body } = await request(app).get('/api/properties/not-a-number').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
        describe('Queries', () => {
            describe('user_id', () => {
                test('?user_id adds another property, favourited, which is a boolean value representing whether the corresponding user has favourited that property', async () => {
                    const { body } = await request(app).get('/api/properties/3?user_id=1').expect(200)
                    const property = body.property
                    expect(typeof property.favourited).toBe('boolean')
                    expect(property.favourited).toBe(false)
                    const { body: body2 } = await request(app).get('/api/properties/3?user_id=6').expect(200)
                    const property2 = body2.property
                    expect(property2.favourited).toBe(true)
                })
                test('returns 404 and msg when passed a user_id which does not exist', async () => {
                    const { body } = await request(app).get('/api/properties/3?user_id=1000').expect(404)
                    expect(body.msg).toBe('User not found')
                })
                test('returns 400 and msg when passed invalid data type', async () => {
                    const { body } = await request(app).get('/api/properties/3?user_id=not-a-number').expect(400)
                    expect(body.msg).toBe('Bad request: invalid data type')
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
        test('if the corresponding property exists but has no reviews, 200 is returned along with a message', async () => {
            const { body } = await request(app).get('/api/properties/2/reviews').expect(200)
            expect(body.msg).toBe('This property currently has no reviews available.')
        })
        test('get request to /api/properties/:id/reviews also returns an average_rating property which calculates the average rating of body.reviews', async () => {
            const { body } = await request(app).get('/api/properties/3/reviews')
            expect(body.average_rating).toBe(4)
        })
        test('returns 404 and msg when passed an id which does not exist', async () => {
            const { body } = await request(app).get('/api/properties/1000/reviews').expect(404)
            expect(body.msg).toBe('Property not found')
        })
        test('returns 400 and msg when passed invalid data type', async () => {
            const { body } = await request(app).get('/api/properties/not-a-number/reviews').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
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
            expect(body.msg).toBe('Bad request: invalid data type')
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
        test('returns 404 and msg when passed an id which does not exist', async () => {
            const { body } = await request(app).post('/api/properties/1000/reviews').send({
                "guest_id": 2,
                "rating": 5,
                "comment": 'Great'
            }).expect(404)
            expect(body.msg).toBe('Property not found')
        })
        test('returns 400 and msg when passed invalid data type for id', async () => {
            const { body } = await request(app).post('/api/properties/not-a-number/reviews').send({
                "guest_id": 2,
                "rating": 5,
                "comment": 'Great'
            }).expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
        test('returns 400 and msg when payload contains an invalid data type', async () => {
            const { body } = await request(app).post('/api/properties/3/reviews').send({
                "guest_id": 'not-a-number',
                "rating": 5,
                "comment": 'Great'
            }).expect(400)
            expect(body.msg).toBe('Bad request: Payload includes invalid data type')
        })
        test('returns 400 and msg when payload missing a not null variable', async () => {
            const { body } = await request(app).post('/api/properties/3/reviews').send({
                "rating": 5,
                "comment": 'Great'
            }).expect(400)
            expect(body.msg).toBe('Bad request: Please provide all required values')
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

    describe('GET /api/reviews/:id', () => {
        test('get request to /api/reviews/:id returns status code 200 and a single review with the following properties: review_id, property_name, guest, rating, comment, created_at', async () => {
            const { body } = await request(app).get('/api/reviews/3').expect(200)
            expect(body.review.hasOwnProperty('review_id')).toBe(true)
            expect(body.review.hasOwnProperty('property_name')).toBe(true)
            expect(body.review.hasOwnProperty('guest')).toBe(true)
            expect(body.review.hasOwnProperty('rating')).toBe(true)
            expect(body.review.hasOwnProperty('comment')).toBe(true)
            expect(body.review.hasOwnProperty('created_at')).toBe(true)
        })
        test('returns 404 and msg when passed a review_id which does not exist', async () => {
            const { body } = await request(app).get('/api/reviews/1000').expect(404)
            expect(body.msg).toBe('Review not found')
        })
        test('returns 400 and msg when passed invalid data type', async () => {
            const { body } = await request(app).get('/api/reviews/not-a-number').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
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
        test('returns 404 and msg when passed a review_id which does not exist', async () => {
            const { body } = await request(app).delete('/api/reviews/1000').expect(404)
            expect(body.msg).toBe('Review not found')
        })
        test('returns 400 and msg when passed invalid data type', async () => {
            const { body } = await request(app).delete('/api/reviews/not-a-number').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
    })

    describe('POST /api/properties/:id/favourite', () => {
        test('successful post request to /api/properties/:id/favourites responds with status 201', async () => {
            await request(app).post('/api/properties/1/favourite').send({
                'guest_id': 2
            }).expect(201)
        })
        test('successful post request to /api/properties/:id/favourites responds with msg and favourite_id', async () => {
            const { body } = await request(app).post('/api/properties/1/favourite').send({
                'guest_id': 2
            })
            expect(body.msg).toBe('Property favourited successfully')
            expect(body.favourite_id).toBe(16)
        })
        test('returns 400 and msg when passed invalid propertyid data type', async () => {
            const { body } = await request(app).post('/api/properties/not-a-number/favourite').send({
                'guest_id': 2
            }).expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 and msg when passed propertyid which does not exist', async () => {
            const { body } = await request(app).post('/api/properties/1000/favourite').send({
                'guest_id': 2
            }).expect(404)
            expect(body.msg).toBe('Property not found')
        })
        test('returns 400 when guest_id invalid', async () => {
            const { body } = await request(app).post('/api/properties/1/favourite').send({
                'guest_id': 'not-a-number'
            }).expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 when guest_id does not exist', async () => {
            const { body } = await request(app).post('/api/properties/1/favourite').send({
                'guest_id': 1000
            }).expect(404)
            expect(body.msg).toBe('User not found')
        })
        test('returns 400 when payload missing a not null variable', async () => {
            const { body } = await request(app).post('/api/properties/1/favourite').send({}).expect(400)
            expect(body.msg).toBe('Bad request: Please provide all required values')
        })
    })

    describe('DELETE /api/properties/:property_id/users/:user_id/favourite', () => {
        test('successful delete request to api/properties/:property_id/users/:user_id/favourite returns 204 and deletes corresponding review', async () => {
            const { rows: beforeDelete } = await db.query(`SELECT * FROM favourites WHERE property_id = $1 AND guest_id = $2`, [1, 6])
            await request(app).delete('/api/properties/1/users/6/favourite').expect(204)
            const { rows: afterDelete } = await db.query(`SELECT * FROM favourites WHERE property_id = $1 AND guest_id = $2`, [1, 6])
            expect(beforeDelete.length).toBe(1)
            expect(afterDelete.length).toBe(0)
        })
        test('returns 400 when property_id or user_id invalid', async () => {
            const { body } = await request(app).delete('/api/properties/not-a-number/users/6/favourite').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
            const { body: body2 } = await request(app).delete('/api/properties/1/users/not-a-number/favourite').expect(400)
            expect(body2.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 when property_id does not exist', async () => {
            const { body } = await request(app).delete('/api/properties/1000/users/6/favourite').expect(404)
            expect(body.msg).toBe('Property not found')
        })
        test('returns 404 when user_id does not exist', async () => {
            const { body } = await request(app).delete('/api/properties/1/users/1000/favourite').expect(404)
            expect(body.msg).toBe('User not found')
        })
    })

    describe('PATCH /api/users/:id', () => {
        test('successful patch request to /api/users/:id returns status 200 and updates when given one column to update in payload', async () => {
            const { body } = await request(app).patch('/api/users/1').send({
                "first_name": 'Barry'
            }).expect(200)
            expect(body.user.first_name).toBe('Barry')
        })
        test('can successfully update multiple columns at once', async () => {
            const { body } = await request(app).patch('/api/users/1').send({
                "first_name": 'Barry',
                "phone_number": '+41 7000 111111'
            })
            expect(body.user.first_name).toBe('Barry')
            expect(body.user.phone_number).toBe('+41 7000 111111')
            const { body: body2 } = await request(app).patch('/api/users/1').send({
                "phone_number": '29',
                "email": 'hello@hello.com',
                "surname": 'Jack'
            })
            expect(body2.user.surname).toBe('Jack')
            expect(body2.user.phone_number).toBe('29')
            expect(body2.user.email).toBe('hello@hello.com')
        })
        test('returns 400 when nothing provided to update', async () => {
            const { body } = await request(app).patch('/api/users/1').send({}).expect(400)
            expect(body.msg).toBe('Bad request: no fields provided to update')
        })
    })

    describe('GET /api/properties/:id/bookings', () => {
        test('returns status 200 and an array of bookings, each with the following properties: booking_id, check_in_date, check_out_date and created_at', async () => {
            const { body } = await request(app).get('/api/properties/1/bookings').expect(200)
            expect(body.bookings.length > 0).toBe(true)
            body.bookings.forEach((booking) => {
                expect(booking.hasOwnProperty('booking_id')).toBe(true)
                expect(booking.hasOwnProperty('check_in_date')).toBe(true)
                expect(booking.hasOwnProperty('check_out_date')).toBe(true)
                expect(booking.hasOwnProperty('created_at')).toBe(true)
            })
        })
        test('body also contains property_id property', async () => {
            const { body } = await request(app).get('/api/properties/1/bookings')
            expect(body.property_id).toBe(1)
        })
        test('returns status 200 and a msg if property_id exists but no bookings associated', async () => {
            const { body } = await request(app).get('/api/properties/11/bookings').expect(200)
            expect(body.msg).toBe('This property has no bookings at this time')
        })
        test('returns 400 when property_id invalid', async () => {
            const { body } = await request(app).get('/api/properties/not-a-number/bookings').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 when property_id does not exist', async () => {
            const { body } = await request(app).get('/api/properties/1000/bookings').expect(404)
            expect(body.msg).toBe('Property not found')
        })
    })

    describe('POST /api/properties/:id/bookings', () => {
        test('returns 201 with msg and booking_id upon successful post', async () => {
            const { body } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_in_date': '2025-11-11',
                'check_out_date': '2025-12-12'
            }).expect(201)
            expect(body.booking_id).toBe(11)
            expect(body.msg).toBe('Booking successful')
        })
        test('returns 400 when property_id or anything in payload is invalid', async () => {
            const { body } = await request(app).post('/api/properties/not-a-number/bookings').send({
                'guest_id': 1,
                'check_in_date': '2025-11-11',
                'check_out_date': '2025-12-12'
            }).expect(400)
            const { body: body2 } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 'not-a-number',
                'check_in_date': '2025-11-11',
                'check_out_date': '2025-12-12'
            }).expect(400)
            const { body: body3 } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_in_date': 'not-a-date',
                'check_out_date': '2025-12-12'
            }).expect(400)
            const { body: body4 } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_in_date': '2025-11-11',
                'check_out_date': 'not-a-date'
            }).expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
            expect(body2.msg).toBe('Bad request: invalid data type')
            expect(body3.msg).toBe('Bad request: invalid data type')
            expect(body4.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 when property_id or guest_id does not exist', async () => {
            const { body } = await request(app).post('/api/properties/1000/bookings').send({
                'guest_id': 1,
                'check_in_date': '2025-11-11',
                'check_out_date': '2025-12-12'
            }).expect(404)
            expect(body.msg).toBe('Property not found')
            const { body: body2 } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1000,
                'check_in_date': '2025-11-11',
                'check_out_date': '2025-12-12'
            }).expect(404)
            expect(body2.msg).toBe('User not found')
        })
        test('returns 400 when payload missing a not null variable', async () => {
            const { body } = await request(app).post('/api/properties/1/bookings').send({
                'check_in_date': '2025-11-11',
                'check_out_date': '2025-12-12'
            }).expect(400)
            expect(body.msg).toBe('Bad request: Please provide all required values')
            const { body: body2 } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_out_date': '2025-12-12'
            }).expect(400)
            expect(body2.msg).toBe('Bad request: Please provide all required values')
        })
        test('returns 400 if check in or check out is in the past, or if check out is before check in', async () => {
            const { body } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_in_date': '2024-11-11',
                'check_out_date': '2025-12-12'
            }).expect(400)
            expect(body.msg).toBe('Bad request: check in/check out cannot be in the past')
            const { body: body2 } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_in_date': '2025-12-13',
                'check_out_date': '2025-12-12'
            }).expect(400)
            expect(body2.msg).toBe('Bad request: check out must be after check in')
        })
        test('returns 400 when provided invalid date', async () => {
            const { body } = await request(app).post('/api/properties/1/bookings').send({
                'guest_id': 1,
                'check_in_date': '2025-55-66',
                'check_out_date': '2025-12-12'
            }).expect(400)
            expect(body.msg).toBe('Bad request: invalid date provided')
        })
    })

    describe('DELETE /api/bookings/:id', () => {
        test('returns 204 upon successfull deletion', async () => {
            const { rows: beforeDelete } = await db.query(`SELECT * FROM bookings WHERE booking_id = 1;`)
            expect(beforeDelete.length).toBe(1)
            await request(app).delete('/api/bookings/1').expect(204)
            const { rows: afterDelete } = await db.query(`SELECT * FROM bookings WHERE booking_id = 1;`)
            expect(afterDelete.length).toBe(0)
        })
        test('returns 400 when booking_id invalid', async () => {
            const { body } = await request(app).delete('/api/bookings/not-a-number').expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 when booking_id does not exist', async () => {
            const { body } = await request(app).delete('/api/bookings/1000').expect(404)
            expect(body.msg).toBe('Booking not found')
        })
    })

    describe('PATCH /api/bookings/:id', () => {
        test('returns 200 and updates all properties of row after successful update', async () => {
            const { body } = await request(app).patch('/api/bookings/1').send({
                "check_in_date": '2025-12-02',
                "check_out_date": '2025-12-31'
            }).expect(200)
            expect(body.booking.booking_id).toBe(1)
            expect(body.booking.check_in_date).toMatch(/^2025-12-02/)
            expect(body.booking.check_out_date).toMatch(/^2025-12-31/)
        })
        test('returns 400 when booking_id or anything in payload is invalid', async () => {
            const { body } = await request(app).patch('/api/bookings/not-a-number').send({
                "check_in_date": '2025-12-02',
                "check_out_date": '2025-12-31'
            }).expect(400)
            const { body: body2 } = await request(app).patch('/api/bookings/1').send({
                "check_in_date": 'not-a-number',
                "check_out_date": '2025-12-31'
            }).expect(400)
            const { body: body3 } = await request(app).patch('/api/bookings/1').send({
                "check_in_date": '2025-12-02',
                "check_out_date": 'not-a-number'
            }).expect(400)
            expect(body.msg).toBe('Bad request: invalid data type')
            expect(body2.msg).toBe('Bad request: invalid data type')
            expect(body3.msg).toBe('Bad request: invalid data type')
        })
        test('returns 404 when booking_id does not exist', async () => {
            const { body } = await request(app).patch('/api/bookings/1000').send({
                "check_in_date": '2025-12-02',
                "check_out_date": '2025-12-31'
            }).expect(404)  
            expect(body.msg).toBe('Booking not found')          
        })
        test('returns 400 when provided invalid date', async () => {
            const { body } = await request(app).patch('/api/bookings/1').send({
                "check_in_date": '2025-55-66',
                "check_out_date": '2025-12-31'
            }).expect(400)       
            expect(body.msg).toBe('Bad request: invalid date provided')       
        })
        test('returns 400 when check in or check out is in the past', async () => {
            const { body } = await request(app).patch('/api/bookings/1').send({
                "check_in_date": '2023-11-11',
                "check_out_date": '2025-12-31'
            }).expect(400)   
            expect(body.msg).toBe('Bad request: check in/check out cannot be in the past')        
        })
        test('returns 400 if only one date to update is provided which attempts to place check out before check in', async () => {
            const { body } = await request(app).patch('/api/bookings/1').send({
                "check_in_date": '2025-12-12',
            }).expect(400)
            expect(body.msg).toBe('Bad request: check out must be after check in')    
        })
        test('returns 400 if nothing provided to update', async () => {
            const { body } = await request(app).patch('/api/bookings/1').send({}).expect(400)
            expect(body.msg).toBe('Bad request: no fields provided to update')               
        })
    })
})