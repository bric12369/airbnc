const formatPropertiesData = require('../utils/format-properties-data')

describe('formatPropertiesData', () => {
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
        const result = formatPropertiesData(testUsersData, testPropertiesData)
        expect(result[0]).toHaveProperty('host_id')
    })
})