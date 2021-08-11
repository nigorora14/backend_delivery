const db = require('../config/config')

const Product = {}

Product.findByCategory = (id_category) => {
    const sql =`
    SELECT P.ID, P.NAME, P.DESCRIPTION, PRICE, IMAGE1, IMAGE2, IMAGE3, ID_CATEGORY
      FROM PRODUCTS AS P INNER JOIN CATEGORIES AS C ON P.ID_CATEGORY = C.ID
     WHERE C.ID=$1
    `;
    return db.manyOrNone(sql, id_category);
}
Product.create = (product) => {
    const sql=`
    INSERT INTO products(
        name, description, price, image1, image2, image3, id_category, create_at, update_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING ID
    `;
    return db.oneOrNone(sql, [
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
        new Date()
    ])
}
Product.update = (product) => {
    const sql=`
    UPDATE PRODUCTS SET NAME=$2, DESCRIPTION = $3, PRICE=$4, IMAGE1= $5, IMAGE2= $6, IMAGE3= $7, ID_CATEGORY=$8, UPDATE_AT=$9
    WHERE ID=$1
    `;
    return db.none(sql, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date()
    ])
}


module.exports = Product