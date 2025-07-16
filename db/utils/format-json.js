const formatJson = (jsonData) => {
    const formattedData = []
    if (!jsonData || !jsonData.length) return formattedData
    jsonData.forEach((jsonObj) => {
        const formattedJsonObj = []
        for (const key in jsonObj) {
            const value = jsonObj[key]
            formattedJsonObj.push(value)
        }
        formattedData.push(formattedJsonObj)
    })
    return formattedData
}

module.exports = formatJson