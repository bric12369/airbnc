const app = require('../app')
const request = require('supertest')

describe('app', () => {
    describe('GET /api/properties', () => {
        test('get request to /api/properties returns status 200', async () => {
            await request(app).get('/api/properties').expect(200)
        })
    })
})