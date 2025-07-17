const { replaceHostNamesWithIds, sortKeysInPropertiesData } = require('../utils/format-properties-data')
const { usersData, propertiesData } = require('../data/test')

describe('replaceHostNamesWithIds', () => {
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
        const result = replaceHostNamesWithIds(testUsersData, testPropertiesData)
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
        const result = replaceHostNamesWithIds(testUsersData, testPropertiesData)
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
        const result = replaceHostNamesWithIds(testUsersData, testPropertiesData)
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
        const result = replaceHostNamesWithIds(testUsersData, testPropertiesData)
        expect(result[0].host_id).toBe(1)
        expect(result[1].host_id).toBe(1)
        expect(result[2].host_id).toBe(1)
    })
    test('test cases', () => {
        const testUsersData = usersData
        const testPropertiesData = propertiesData
        const result = replaceHostNamesWithIds(testUsersData, testPropertiesData)
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
        const result = replaceHostNamesWithIds(testUsersData, testPropertiesData)
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
        replaceHostNamesWithIds(testUsersData, testPropertiesData)
        expect(testUsersData).toEqual(testUsersDataCopy)
        expect(testPropertiesData).toEqual(testPropertiesDataCopy)
    })
})

describe('sortKeysInPropertiesData', () => {
    test('drops the amenities key of a formatted property', () => {
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
        const formatted = replaceHostNamesWithIds(usersData, testPropertiesData)
        const result = sortKeysInPropertiesData(formatted)
        expect(result[0]).not.toHaveProperty('amenities')
    })
    test('orders the keys of one formatted property to match the expected database format', () => {
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
        const formatted = replaceHostNamesWithIds(usersData, testPropertiesData)
        const expected = [
            {
                host_id: 1,
                name: 'Modern Apartment in City Center',
                location: 'London, UK',
                property_type: 'Apartment',
                price_per_night: 120,
                description: 'Description of Modern Apartment in City Center.',
            }
        ]
        const result = sortKeysInPropertiesData(formatted)
        expect(Object.keys(result[0])).toEqual(Object.keys(expected[0]))
        expect(result).toEqual(expected)
    })
    test('orders the keys of multiple formatted properties to match the expected database format', () => {
        const formatted = replaceHostNamesWithIds(usersData, propertiesData)
        const result = sortKeysInPropertiesData(formatted)
        const expectedProperty = {
            host_id: 3,
            name: "Elegant City Apartment",
            location: "Birmingham, UK",
            property_type: "Apartment",
            price_per_night: 110.0,
            description: "Description of Elegant City Apartment."
        }
        expect(Object.keys(result[3])).toEqual(Object.keys(expectedProperty))
        expect(result[3]).toEqual(expectedProperty)
    })
    test('does not mutate input', () => {
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
        const formatted = replaceHostNamesWithIds(usersData, testPropertiesData)
        sortKeysInPropertiesData(formatted)
        expect(testPropertiesData).toEqual(testPropertiesDataCopy)
    })
})