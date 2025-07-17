const replacePropertyNamesWithIds = (reviews, properties) => {
    const reviewsWithPropertyIds = structuredClone(reviews)
    const propertyNames = properties.map((property) => {
        return property.name
    })
    for (let i = 0; i < reviewsWithPropertyIds.length; i++) {
        const review = reviewsWithPropertyIds[i]
        if (propertyNames.includes(review.property_name)) {
            review.property_id = propertyNames.indexOf(review.property_name) + 1
            delete review.property_name
        }
    }
    return reviewsWithPropertyIds
}

const replaceGuestNamesWithIds = () => {

}

const sortKeysInReviewsData = () => {

}

module.exports = { replacePropertyNamesWithIds, replaceGuestNamesWithIds, sortKeysInReviewsData }