const formatReviews = require('../utils/format-reviews-data')
const { replacePropertyNamesWithIds, replaceGuestNamesWithIds, replaceReviewNamesWithIds, sortKeys } = formatReviews
const { reviewsData, propertiesData, usersData, imagesData } = require('../data/test')

describe('replacePropertyNamesWithIds', () => {
    test('takes reviews and properties. When passed an array of single review and an array of property with matching name, replaces property_name in review with corresponding property_id', () => {
        const testReviewsData = [
            {
                "guest_name": "Bob Smith",
                "property_name": "Modern Apartment in City Center",
                "rating": 2,
                "comment": "Comment about Modern Apartment in City Center",
                "created_at": "2024-04-12T14:45:00Z"
            }
        ]
        const testPropertiesData = [
            {
                "name": "Modern Apartment in City Center",
                "property_type": "Apartment",
                "location": "London, UK",
                "price_per_night": 120.0,
                "description": "Description of Modern Apartment in City Center.",
                "host_name": "Alice Johnson",
                "amenities": ["WiFi", "TV", "Kitchen"]
            }
        ]
        const result = replacePropertyNamesWithIds(testReviewsData, testPropertiesData)
        expect(result[0].property_id).toBe(1)
        expect(result[0]).not.toHaveProperty('property_name')
    })
    test('When passed an array of reviews and an array of properties, replaces property_name with corresponding property_id for each review', () => {
        const result = replacePropertyNamesWithIds(reviewsData, propertiesData)
        expect(result[2].property_id).toBe(6)
        expect(result[2]).not.toHaveProperty('property_name')
        expect(result[4].property_id).toBe(9)
        expect(result[4]).not.toHaveProperty('property_name')
    })
    test('does not mutate inputs', () => {
        const testReviewsData = [
            {
                "guest_name": "Bob Smith",
                "property_name": "Modern Apartment in City Center",
                "rating": 2,
                "comment": "Comment about Modern Apartment in City Center",
                "created_at": "2024-04-12T14:45:00Z"
            }
        ]
        const testPropertiesData = [
            {
                "name": "Modern Apartment in City Center",
                "property_type": "Apartment",
                "location": "London, UK",
                "price_per_night": 120.0,
                "description": "Description of Modern Apartment in City Center.",
                "host_name": "Alice Johnson",
                "amenities": ["WiFi", "TV", "Kitchen"]
            }
        ]
        const testReviewsDataCopy = [
            {
                "guest_name": "Bob Smith",
                "property_name": "Modern Apartment in City Center",
                "rating": 2,
                "comment": "Comment about Modern Apartment in City Center",
                "created_at": "2024-04-12T14:45:00Z"
            }
        ]
        const testPropertiesDataCopy = [
            {
                "name": "Modern Apartment in City Center",
                "property_type": "Apartment",
                "location": "London, UK",
                "price_per_night": 120.0,
                "description": "Description of Modern Apartment in City Center.",
                "host_name": "Alice Johnson",
                "amenities": ["WiFi", "TV", "Kitchen"]
            }
        ]
        replacePropertyNamesWithIds(testReviewsData, testPropertiesData)
        expect(testReviewsData).toEqual(testReviewsDataCopy)
        expect(testPropertiesData).toEqual(testPropertiesDataCopy)
    })
    test('handles other inputs successfully where property names can be replaced with property ids', () => {
        const result = replacePropertyNamesWithIds(imagesData, propertiesData)
        result.forEach((image) => {
            expect(image).not.toHaveProperty('property_name')
            expect(image).toHaveProperty('property_id')
        })
    })
})

describe('replaceGuestNamesWithIds', () => {
    test('takes reviews and users. When passed an array of single review and an array of user with matching name, replaces guest_name in review with corresponding guest_id', () => {
        const testReviewsData = [
            {
                "guest_name": "Bob Smith",
                "property_name": "Modern Apartment in City Center",
                "rating": 2,
                "comment": "Comment about Modern Apartment in City Center",
                "created_at": "2024-04-12T14:45:00Z"
            }
        ]
        const testUsersData = [
            {
                "first_name": "Bob",
                "surname": "Smith",
                "email": "bob@example.com",
                "phone_number": "+44 7000 222222",
                "is_host": false,
                "avatar": "https://example.com/images/bob.jpg"
              }
        ]
        const result = replaceGuestNamesWithIds(testReviewsData, testUsersData)
        expect(result[0].guest_id).toBe(1)
        expect(result[0]).not.toHaveProperty('user_name')
    })
    test('When passed an array of reviews and an array of users, replaces guest_name with corresponding guest_id for each review', () => {
        const result = replaceGuestNamesWithIds(reviewsData, usersData)
        expect(result[0].guest_id).toBe(4)
        expect(result[2]).not.toHaveProperty('guest_name')
    })
    test('does not mutate inputs', () => {
        const testReviewsData = [
            {
                "guest_name": "Bob Smith",
                "property_name": "Modern Apartment in City Center",
                "rating": 2,
                "comment": "Comment about Modern Apartment in City Center",
                "created_at": "2024-04-12T14:45:00Z"
            }
        ]
        const testUsersData = [
            {
                "first_name": "Bob",
                "surname": "Smith",
                "email": "bob@example.com",
                "phone_number": "+44 7000 222222",
                "is_host": false,
                "avatar": "https://example.com/images/bob.jpg"
              }
        ]
        const testReviewsDataCopy = [
            {
                "guest_name": "Bob Smith",
                "property_name": "Modern Apartment in City Center",
                "rating": 2,
                "comment": "Comment about Modern Apartment in City Center",
                "created_at": "2024-04-12T14:45:00Z"
            }
        ]
        const testUsersDataCopy = [
            {
                "first_name": "Bob",
                "surname": "Smith",
                "email": "bob@example.com",
                "phone_number": "+44 7000 222222",
                "is_host": false,
                "avatar": "https://example.com/images/bob.jpg"
              }
        ]
        replaceGuestNamesWithIds(testReviewsData, testUsersData)
        expect(testReviewsData).toEqual(testReviewsDataCopy)
        expect(testUsersData).toEqual(testUsersDataCopy)
    })
})

describe('replaceReviewNamesWithIds', () => {
    test('removes guest and property names in reviews and replaces them with ids', () => {
        const result = replaceReviewNamesWithIds(reviewsData, propertiesData, usersData)
        expect(result[0].property_id).toBe(3)
        expect(result[0].guest_id).toBe(4)
        for (let i = 0; i < result.length; i++) {
            const currResult = result[i]
            expect(currResult).not.toHaveProperty('property_name')
            expect(currResult).not.toHaveProperty('guest_name')
            expect(currResult).toHaveProperty('property_id')
            expect(currResult).toHaveProperty('guest_id')
        }
    })
    test('does not mutate inputs', () => {
        const reviewsDataCopy = structuredClone(reviewsData)
        const propertiesDataCopy = structuredClone(propertiesData)
        const usersDataCopy = structuredClone(usersData)
        replaceReviewNamesWithIds(reviewsData, propertiesData, usersData)
        expect(reviewsData).toEqual(reviewsDataCopy)
        expect(propertiesData).toEqual(propertiesDataCopy)
        expect(usersData).toEqual(usersDataCopy)
    })
})

describe('sortKeys', () => {
    test('orders the keys of one updated review to match the expected database format', () => {
        const updatedReviewTest = [
            {
                rating: 4,
                comment: 'Comment about Chic Studio Near the Beach',
                created_at: '2024-03-28T10:15:00Z',
                property_id: 3,
                guest_id: 4
              } 
        ]
        const keyOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
        const expected = [
            {
                property_id: 3,
                guest_id: 4,
                rating: 4,
                comment: 'Comment about Chic Studio Near the Beach',
                created_at: '2024-03-28T10:15:00Z'
              } 
        ]
        const result = sortKeys(updatedReviewTest, keyOrder)
        expect(Object.keys(result[0])).toEqual(Object.keys(expected[0]))
    })
    test('orders the keys of multiple updated reviews to match the expected database format', () => {
        const updatedReviews = replaceReviewNamesWithIds(reviewsData, propertiesData, usersData)
        const keyOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
        const result = sortKeys(updatedReviews, keyOrder)
        result.forEach((review) => {
            expect(Object.keys(review)).toEqual(keyOrder)
        })
    })
    test('accepts any array of json objects and orders their keys accordingly', () => {
        const updatedImages = replacePropertyNamesWithIds(imagesData, propertiesData)
        const keyOrder = ['property_id', 'image_url', 'alt_text']
        const result = sortKeys(updatedImages, keyOrder)
        result.forEach((image) => {
            expect(Object.keys(image)).toEqual(keyOrder)
        })
    })
    test('does not mutate input', () => {
        const updatedReviewTest = [
            {
                rating: 4,
                comment: 'Comment about Chic Studio Near the Beach',
                created_at: '2024-03-28T10:15:00Z',
                property_id: 3,
                guest_id: 4
              } 
        ]
        const keyOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
        const updatedReviewTestCopy = [
            {
                rating: 4,
                comment: 'Comment about Chic Studio Near the Beach',
                created_at: '2024-03-28T10:15:00Z',
                property_id: 3,
                guest_id: 4
              } 
        ]
        const keyOrderCopy = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
        sortKeys(updatedReviewTest, keyOrder)
        expect(updatedReviewTest).toEqual(updatedReviewTestCopy)
        expect(keyOrder).toEqual(keyOrderCopy)
    })
})