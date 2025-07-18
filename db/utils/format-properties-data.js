const replaceHostNamesWithIds = (users, properties) => {
    const formattedProperties = structuredClone(properties)
    const usernames = users.map((user) => {
        return user.first_name + ' ' + user.surname
    })
    for (let i = 0; i < formattedProperties.length; i++) {
        const property = formattedProperties[i]
        if (usernames.includes(property.host_name)) {
            property.host_id = usernames.indexOf(property.host_name) + 1
            delete property.host_name
        }
    }
    return formattedProperties
}

module.exports = { replaceHostNamesWithIds }