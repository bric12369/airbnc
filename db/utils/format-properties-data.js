const formatPropertiesData = (users, properties) => {
    const formattedProperties = [...properties]
    const user = users[0]
    const username = user.first_name + ' ' + user.surname
    const property = formattedProperties[0]
    if (username === property.host_name) {
        property.host_id = 1
    }
    return formattedProperties
}

module.exports = formatPropertiesData