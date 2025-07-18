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

const replaceGuestNamesWithIds = (reviews, users) => {
    const reviewsWithGuestIds = structuredClone(reviews)
    const usernames = users.map((user) => {
        return user.first_name + ' ' + user.surname
    })
    for (let i = 0; i < reviewsWithGuestIds.length; i++) {
        const review = reviewsWithGuestIds[i]
        if (usernames.includes(review.guest_name)) {
            review.guest_id = usernames.indexOf(review.guest_name) + 1
            delete review.guest_name
        }
    }
    return reviewsWithGuestIds
}

const replaceReviewNamesWithIds = (reviews, properties, users) => {
    let updatedReviews = replacePropertyNamesWithIds(reviews, properties)
    updatedReviews = replaceGuestNamesWithIds(updatedReviews, users)
    return updatedReviews
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

module.exports = { replacePropertyNamesWithIds, replaceGuestNamesWithIds, replaceReviewNamesWithIds, sortKeys }