const db = require('../config/config')

const Order = {}

// Order.findByUser = (id_user) => {
//     const sql = `
//         SELECT ID, ID_USER, ADDRESS, NEIGHBORHOOD, LAT, LNG
//           FROM ADDRESS
//          WHERE ID_USER = $1
//     `;
//     return db.manyOrNone(sql, id_user)
// }
Order.create = (order) => {
    const sql = `
        INSERT INTO ORDERS (ID_CLIENT, ID_ADDRESS, STATUS, TIMESTAMP, CREATE_AT, UPDATE_AT)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING ID
    `;
    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now(),
        new Date(),
        new Date()
    ])
}

module.exports = Order