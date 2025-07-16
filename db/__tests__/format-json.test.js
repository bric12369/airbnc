const formatJson = require('../utils/format-json')

describe('formatJson', () => {
    test('returns an array when passed no arg', () => {
        expect(formatJson()).toEqual([])
    })
})