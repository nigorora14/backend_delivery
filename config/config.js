const promise = require('bluebird')
const options = {
    promiseLib: promise,
    query:(e)=>{}
}
const pgp=require('pg-promise')(options)
const types = pgp.pg.types
types.setTypeParser(1114, function(stringValue){
    return stringValue
})

const databaseConfig={
    'host': 'ec2-3-211-221-185.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'd9l0bp8ln8t730',
    'user': 'zszsmeqlcyyyhk',
    'password': 'ae3d59d5573fb0dedf7428077a3a2e07b59f967428e8e3ce4576f3b884182ef6',
    ssl: {
        rejectUnauthorized: false
    },
    /*
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': '14@qweszxC'
    */
}
const db = pgp(databaseConfig)
module.exports = db