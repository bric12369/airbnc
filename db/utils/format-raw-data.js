const replacePropertyNamesWithIds = (items, properties) => {
    const itemsWithPropertyIds = structuredClone(items)
    const propertyNames = properties.map((property) => {
        return property.name
    })
    for (let i = 0; i < itemsWithPropertyIds.length; i++) {
        const item = itemsWithPropertyIds[i]
        if (propertyNames.includes(item.property_name)) {
            item.property_id = propertyNames.indexOf(item.property_name) + 1
            delete item.property_name
        }
    }
    return itemsWithPropertyIds
}

const replacePeopleNamesWithIds = (users, items) => {
    const itemsWithNameIds = structuredClone(items)
    const usernames = users.map((user) => {
        return user.first_name + ' ' + user.surname
    })
    for (let i = 0; i < itemsWithNameIds.length; i++) {
        const fieldstoUpdate = [
            { nameKey: 'host_name', idKey: 'host_id' },
            { nameKey: 'guest_name', idKey: 'guest_id' }
        ]
        const item = itemsWithNameIds[i]

        for (const { nameKey, idKey } of fieldstoUpdate) {
            if (item[nameKey] && usernames.includes(item[nameKey])) {
                item[idKey] = usernames.indexOf(item[nameKey]) + 1
                delete item[nameKey]
            }
        }
    }
    return itemsWithNameIds
}

const sortKeys = (items, keyOrder) => {
    const orderedItems = items.map((item) => {
        const orderedItem = {}
        for (const key of keyOrder) {
            const value = item[key]
            orderedItem[key] = value
        }
        return orderedItem
    })
    return orderedItems
}

const extractUniqueAmenities = (properties) => {
    const uniqueAmenities = []
    properties.forEach((property) => {
        property.amenities.forEach((amenity) => {
            if (!uniqueAmenities.includes(amenity)) uniqueAmenities.push(amenity)
        })
    })
    return uniqueAmenities.map((amenity) => [amenity])
}

const formatPropertiesAmenitiesData = (properties) => {
    const propertiesAmenitiesData = []
    let id = 1
    properties.forEach((property) => {
        property.amenities.forEach((amenity) => {
            propertiesAmenitiesData.push({
                property_id: id,
                amenity: amenity
            })
        })
        id++
    })
    return propertiesAmenitiesData
}

module.exports = { replacePropertyNamesWithIds, replacePeopleNamesWithIds, sortKeys, extractUniqueAmenities, formatPropertiesAmenitiesData }