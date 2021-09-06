const db = require('../config/config')

const Order = {}

Order.findByStatus = (status) => {
    const sql = `
    SELECT O.ID, O.ID_CLIENT, O.ID_ADDRESS, O.ID_DELIVERY, O.STATUS, O.TIMESTAMP,
		   JSON_AGG(
			   JSON_BUILD_OBJECT(
			   		'id',p.id,
				   	'name',p.name,
				   	'description', p.description,
				   	'price', p.price,
				   	'image1', p.image1,
				   	'image2', p.image2,
				   	'image3', p.image3,
				   	'quantity', ohp.quantity
			   )
		   ) AS products,
           JSON_BUILD_OBJECT(
           'id', U.ID,
           'name',U.NAME,
           'lastname',U.LASTNAME,
           'image',U.IMAGE
            ) AS client,
            JSON_BUILD_OBJECT(
            'id', A.ID,
            'address',A.ADDRESS,
            'neighborhood',A.NEIGHBORHOOD,
            'lat',A.LAT,
            'lng',A.LNG
            ) AS address
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE STATUS=$1
	  GROUP BY O.ID, U.ID, A.ID
    `;
    return db.manyOrNone(sql, status);
}
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