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

module.exports = { replacePeopleNamesWithIds }