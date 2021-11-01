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
    'host': 'ec2-52-204-14-80.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'd38kjgr75ra4kf',
    'user': 'fjdqpvzpqrirww',
    'password': '1f461193c4a63ac458e748a6c0d56f51a29f5387dcc70c316f9d253c3f2a8f6b',
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