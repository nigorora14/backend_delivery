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
           'image',U.IMAGE,
           'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
           'id', U2.ID,
           'name',U2.NAME,
           'lastname',U2.LASTNAME,
           'image',U2.IMAGE,
           'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
            'id', A.ID,
            'address',A.ADDRESS,
            'neighborhood',A.NEIGHBORHOOD,
            'lat',A.LAT,
            'lng',A.LNG
            ) AS address
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE STATUS=$1
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
    `;
    return db.manyOrNone(sql, status);
}
Order.findByDeliveryAndStatus = (id_delivery, status) => {
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
           'image',U.IMAGE,
           'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
           'id', U2.ID,
           'name',U2.NAME,
           'lastname',U2.LASTNAME,
           'image',U2.IMAGE,
           'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
            'id', A.ID,
            'address',A.ADDRESS,
            'neighborhood',A.NEIGHBORHOOD,
            'lat',A.LAT,
            'lng',A.LNG
            ) AS address
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE O.ID_DELIVERY=$1
        AND STATUS=$2
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
    `;
    return db.manyOrNone(sql, [id_delivery, status]);
}
Order.findByClientAndStatus = (id_client, status) => {
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
           'image',U.IMAGE,
           'phone', U.phone
            ) AS client,
			JSON_BUILD_OBJECT(
           'id', U2.ID,
           'name',U2.NAME,
           'lastname',U2.LASTNAME,
           'image',U2.IMAGE,
           'phone', U2.phone
            ) AS delivery,
            JSON_BUILD_OBJECT(
            'id', A.ID,
            'address',A.ADDRESS,
            'neighborhood',A.NEIGHBORHOOD,
            'lat',A.LAT,
            'lng',A.LNG
            ) AS address
       FROM ORDERS AS O INNER JOIN USERS AS U ON O.ID_CLIENT = U.ID
	   		LEFT JOIN USERS AS U2 ON O.ID_DELIVERY = U2.ID
            INNER JOIN ADDRESS AS A ON A.ID = O.ID_ADDRESS
			INNER JOIN ORDERS_HAS_PRODUCTS AS OHP ON OHP.ID_ORDER = O.ID
			INNER JOIN PRODUCTS AS P ON P.ID = OHP.ID_PRODUCT
      WHERE O.ID_CLIENT=$1
        AND STATUS=$2
	  GROUP BY O.ID, U.ID, A.ID, U2.ID
    `;
    return db.manyOrNone(sql, [id_client, status]);
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
Order.update = (order) => {
    const sql= `
    UPDATE ORDERS SET ID_CLIENT= $2, ID_ADDRESS=$3, ID_DELIVERY = $4, STATUS= $5, UPDATE_AT =$6
     WHERE ID = $1
    `;
    return db.none(sql, [
        order.id,
        order.id_client,
        order.id_address,
        order.id_delivery,
        order.status,
        new Date()
    ])
}

module.exports = Order
