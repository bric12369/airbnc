const formatPropertiesData = (users, properties) => {
    const formattedProperties = [...properties]
    const usernames = users.map((user) => {
        return user.first_name + ' ' + user.surname
    })
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        if (usernames.includes(property.host_name)) {
            property.host_id = usernames.indexOf(property.host_name) + 1
        }
    }
    return formattedProperties
}

module.exports = formatPropertiesData