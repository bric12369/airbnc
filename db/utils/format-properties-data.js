const replaceHostNamesWithIds = (users, properties) => {
    const formattedProperties = [...properties]
    const usernames = users.map((user) => {
        return user.first_name + ' ' + user.surname
    })
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        if (usernames.includes(property.host_name)) {
            property.host_id = usernames.indexOf(property.host_name) + 1
            delete property.host_name
        }
    }
    return formattedProperties
}

const sortKeysInPropertiesData = (formattedProperties) => {
    const keyOrder = ['host_id', 'name', 'location', 'property_type', 'price_per_night', 'description']
    const orderedProperties = formattedProperties.map((property) => {
        const orderedProperty = {}
        for (const key of keyOrder) {
            const value = property[key]
            orderedProperty[key] = value
        }
        return orderedProperty
    })
    return orderedProperties
}

module.exports = { replaceHostNamesWithIds, sortKeysInPropertiesData }