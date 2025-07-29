const formatJson = require('../db/utils/format-json')
const { propertyTypesData } = require('../db/data/test/index')

describe('formatJson', () => {
    test('returns an array when passed no arg', () => {
        expect(formatJson()).toEqual([])
    })
    test('When passed an array of single JSON object containing a single property, returns an array of single array containing the value of that property', () => {
        const testJsonData = [{"test": "One"}]
        const expected = [['One']]
        expect(formatJson(testJsonData)).toEqual(expected)
    })
    test('When passed an array of single JSON object containing multiple properties, returns an array of single array containing the values of those properties', () => {
        const testJsonData = [
            {
                "test": "One",
                "test2": "Two",
                "test3": "Three"
            }
        ]
        const expected = [['One', 'Two', 'Three']]
        expect(formatJson(testJsonData)).toEqual(expected)
    })
    test('When passed an array of multiple JSON objects containing multiple properties, returns an array of a corresponding number of sub-arrays containing the values for each JSON object\'s properties', () => {
        const testJsonData = [
            {
                "test": "One",
                "test2": "Two"
            }, 
            {
                "test3": "Three",
                "Test4": "Four"
            }
        ]
        const expected = [
            ['One', 'Two'],
            ['Three', 'Four']
        ]
        expect(formatJson(testJsonData)).toEqual(expected)
        const expectedPropertyTypes = [
            ['Apartment', 'Description of Apartment.'],
            ['House', 'Description of House.'],
            ['Studio', 'Description of Studio.']
        ]
        expect(formatJson(propertyTypesData)).toEqual(expectedPropertyTypes)
    })
    test('does not mutate input json data', () => {
        const testJsonData = [{"test": "One"}]
        const testJsonDataCopy = [{"test": "One"}]
        formatJson(testJsonData)
        expect(testJsonData).toEqual(testJsonDataCopy)
    })
    test('same input always provides the same output', () => {
        const testJsonData = [{"test": "One"}]
        const expected = [['One']]
        formatJson(testJsonData)
        formatJson(testJsonData)
        formatJson(testJsonData)
        expect(formatJson(testJsonData)).toEqual(expected)
    })
})