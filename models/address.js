const db = require('../config/config')

const Address = {}

Address.findByUser = (id_user) => {
    const sql = `
        SELECT ID, ID_USER, ADDRESS, NEIGHBORHOOD, LAT, LNG
          FROM ADDRESS
         WHERE ID_USER = $1
    `;
    return db.manyOrNone(sql, id_user)
}
Address.create = (address) => {
    const sql = `
        INSERT INTO ADDRESS (ID_USER, ADDRESS, NEIGHBORHOOD, LAT, LNG, CREATE_AT, UPDATE_AT)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING ID
    `;
    return db.oneOrNone(sql, [
        address.id_user,
        address.address,
        address.neighborhood,
        address.lat,
        address.lng,
        new Date(),
        new Date()
    ])
}

module.exports = Address