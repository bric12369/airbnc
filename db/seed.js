const dropAllTables = require('./drop-all-tables')
const createAllTables = require('./create-all-tables')
const insertAllData = require('./insert-all-data')

async function seed() {
    
    await dropAllTables()

    await createAllTables()

    await insertAllData()
}

module.exports = seed