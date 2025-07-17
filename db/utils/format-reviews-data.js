const replacePropertyNamesWithIds = (reviews, properties) => {
    const formattedReviews = structuredClone(reviews)
    if (formattedReviews[0].property_name === properties[0].name) {
        formattedReviews[0].property_id = 1
        delete formattedReviews[0].property_name
    }
    return formattedReviews
}

const replaceGuestNamesWithIds = () => {

}

const sortKeysInReviewsData = () => {

}

module.exports = { replacePropertyNamesWithIds, replaceGuestNamesWithIds, sortKeysInReviewsData }