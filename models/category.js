const db = require('../config/config')

const Category= {}

Category.create = (category) => {
    const sql=`
        INSERT INTO CATEGORIES (NAME, DESCRIPTION, CREATE_AT, UPDATE_AT)
        VALUES ($1, $2, $3, $4) RETURNING ID
    `;
    return db.oneOrNone(sql, [
        category.name,
        category.description,
        new Date(),
        new Date()
    ])
}

module.exports=Category