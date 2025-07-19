const formatReviews = require('../utils/format-raw-data')
const { replacePropertyNamesWithIds, replacePeopleNamesWithIds, sortKeys } = formatReviews
const { reviewsData, propertiesData, usersData, imagesData, favouritesData } = require('../data/test')

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

describe('replacePeopleNamesWithIds', () => {
    test('takes an array of user JSON objects and an array of property JSON objects. When passed array of single user with is_host true and single property whose host_name matches user first and surname, assigns a host_id property', () => {
        const testUsersData = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
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
        const result = replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(result[0]).toHaveProperty('host_id')
    })
    test('assigns host_id properties to all property objects when passed an array of multiple properties and an array of multiple users', () => {
        const testUsersData = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
            },
            {
                "first_name": "Bob",
                "surname": "Smith",
                "email": "bob@example.com",
                "phone_number": "+44 7000 222222",
                "is_host": true,
                "avatar": "https://example.com/images/bob.jpg"
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
            },
            {
                "name": "Cosy Family House",
                "property_type": "House",
                "location": "Manchester, UK",
                "price_per_night": 150.0,
                "description": "Description of Cosy Family House.",
                "host_name": "Bob Smith",
                "amenities": ["WiFi", "Parking", "Kitchen"]
            }
        ]
        const result = replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(result[1]).toHaveProperty('host_id')
    })
    test('handles users array where some users are not hosts. Skips these and assigns host id keys to properties accordingly and incrementally', () => {
        const testUsersData = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
            },
            {
                "first_name": "Bob",
                "surname": "Smith",
                "email": "bob@example.com",
                "phone_number": "+44 7000 222222",
                "is_host": false,
                "avatar": "https://example.com/images/bob.jpg"
            },
            {
                "first_name": "Emma",
                "surname": "Davis",
                "email": "emma@example.com",
                "phone_number": "+44 7000 333333",
                "is_host": true,
                "avatar": "https://example.com/images/emma.jpg"
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
            },
            {
                "name": "Cosy Family House",
                "property_type": "House",
                "location": "Manchester, UK",
                "price_per_night": 150.0,
                "description": "Description of Cosy Family House.",
                "host_name": "Emma Davis",
                "amenities": ["WiFi", "Parking", "Kitchen"]
            }
        ]
        const result = replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(result[0].host_id).toBe(1)
        expect(result[1].host_id).toBe(3)
    })
    test('assigns the same host_id to multiple properties with the same host', () => {
        const testUsersData = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
            },
            {
                "first_name": "Bob",
                "surname": "Smith",
                "email": "bob@example.com",
                "phone_number": "+44 7000 222222",
                "is_host": false,
                "avatar": "https://example.com/images/bob.jpg"
            },
            {
                "first_name": "Emma",
                "surname": "Davis",
                "email": "emma@example.com",
                "phone_number": "+44 7000 333333",
                "is_host": true,
                "avatar": "https://example.com/images/emma.jpg"
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
            },
            {
                "name": "Cosy Family House",
                "property_type": "House",
                "location": "Manchester, UK",
                "price_per_night": 150.0,
                "description": "Description of Cosy Family House.",
                "host_name": "Alice Johnson",
                "amenities": ["WiFi", "Parking", "Kitchen"]
            },
            {
                "name": "Chic Studio Near the Beach",
                "property_type": "Studio",
                "location": "Brighton, UK",
                "price_per_night": 90.0,
                "description": "Description of Chic Studio Near the Beach.",
                "host_name": "Alice Johnson",
                "amenities": ["WiFi"]
            }
        ]
        const result = replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(result[0].host_id).toBe(1)
        expect(result[1].host_id).toBe(1)
        expect(result[2].host_id).toBe(1)
    })
    test('test cases', () => {
        const testUsersData = usersData
        const testPropertiesData = propertiesData
        const result = replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(result[3].host_id).toBe(3)
        expect(result[4].host_id).toBe(3)
        expect(result[6].host_id).toBe(5)
        expect(result[10].host_id).toBe(1)
    })
    test('removes host_name', () => {
        const testUsersData = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
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
        const result = replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(result[0]).not.toHaveProperty('host_name')
    })
    test('does not mutate passed in users or properties data', () => {
        const testUsersData = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
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
        const testUsersDataCopy = [
            {
                "first_name": "Alice",
                "surname": "Johnson",
                "email": "alice@example.com",
                "phone_number": "+44 7000 111111",
                "is_host": true,
                "avatar": "https://example.com/images/alice.jpg"
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
        replacePeopleNamesWithIds(testUsersData, testPropertiesData)
        expect(testUsersData).toEqual(testUsersDataCopy)
        expect(testPropertiesData).toEqual(testPropertiesDataCopy)
    })
    test('also replaces guest_ids in favourites with user_id', () => {
        const result = replacePeopleNamesWithIds(usersData, favouritesData)
        result.forEach((favourite) => {
            expect(favourite).not.toHaveProperty('guest_name')
            expect(favourite).toHaveProperty('guest_id')
        })
        expect(result[2].guest_id).toBe(2)
        expect(result[5].guest_id).toBe(2)
        expect(result[9].guest_id).toBe(6)
    })
    test('also replaces guest_ids in reviews with user_id', () => {
        const result = replacePeopleNamesWithIds(usersData, reviewsData)
        result.forEach((review) => {
            expect(review).not.toHaveProperty('guest_name')
            expect(review).toHaveProperty('guest_id')
        })
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
        const reviewsWithpropertyIds = replacePropertyNamesWithIds(reviewsData, propertiesData)
        const updatedReviews = replacePeopleNamesWithIds(usersData, reviewsWithpropertyIds)
        const keyOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
        const result = sortKeys(updatedReviews, keyOrder)
        result.forEach((review) => {
            expect(Object.keys(review)).toEqual(keyOrder)
        })
    })
    test('accepts any array of json objects and orders their keys accordingly', () => {
        const updatedImages = replacePropertyNamesWithIds(imagesData, propertiesData)
        const keyOrder = ['property_id', 'image_url', 'alt_tag']
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