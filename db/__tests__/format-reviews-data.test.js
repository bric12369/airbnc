const { replacePropertyNamesWithIds, replaceGuestNamesWithIds, sortKeysInReviewsData } = require('../utils/format-reviews-data')

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
})