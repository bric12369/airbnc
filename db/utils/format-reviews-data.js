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

const sortKeysInReviewsData = (updatedReviews) => {
    const keyOrder = ['property_id', 'guest_id', 'rating', 'comment', 'created_at']
    const orderedReviews = updatedReviews.map((review) => {
        const orderedReview = {}
        for (const key of keyOrder) {
            const value = review[key]
            orderedReview[key] = value
        }
        return orderedReview
    })
    return orderedReviews
}

module.exports = { replacePropertyNamesWithIds, replaceGuestNamesWithIds, replaceReviewNamesWithIds, sortKeysInReviewsData }