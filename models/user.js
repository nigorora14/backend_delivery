const db = require('../config/config')
const crypto = require('crypto')

const User = {}

User.getAll = () => {
    const sql='Select * from users'
    return db.manyOrNone(sql)
}
User.create = (user) => {
    //ENCRYPTAR
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex')
    user.password = myPasswordHashed
    //FIN ENCRYPTAR
    const sql= `
    insert into users (
        email,name,lastname,phone,image,password,session_token,create_at,update_at
    )values(
        $1,$2,$3,$4,$5,$6,$7,$8,$9) returning id
    `
    return db.oneOrNone(sql, [
        user.email,user.name,user.lastname,user.phone,user.image,user.password,user.session_token,new Date(),new Date()
    ])
}
User.findByEmail = (email) => {
    const sql= `
    SELECT u.ID,EMAIL,u.NAME,LASTNAME,u.IMAGE,PHONE,PASSWORD,SESSION_TOKEN,
    json_agg(
        json_build_object(
                'id', r.id,
             'name', r.name,
             'image', r.image,
             'route', r.route
        )
    ) as roles		
FROM USERS as u inner join user_has_roles as uhr on u.id=uhr.id_user
                 inner join roles r on uhr.id_rol=r.id 
WHERE u.EMAIL = $1
group by u.id
    `
    return db.oneOrNone(sql, email);
}
User.findByDeliveryMen = () => {
    const sql= `
    SELECT u.ID,EMAIL,u.NAME,LASTNAME,u.IMAGE,PHONE,PASSWORD,SESSION_TOKEN
    FROM USERS AS U INNER JOIN USER_HAS_ROLES AS UHR ON UHR.ID_USER = U.ID
                    INNER JOIN ROLES AS R ON R.ID = UHR.ID_ROL
    WHERE R.ID = 3
    `;
    return db.manyOrNone(sql);
}
User.findByUserId= (id) => {
    const sql= `
    SELECT u.ID,EMAIL,u.NAME,LASTNAME,u.IMAGE,PHONE,PASSWORD,SESSION_TOKEN,
    json_agg(
        json_build_object(
                'id', r.id,
             'name', r.name,
             'image', r.image,
             'route', r.route
        )
    ) as roles		
FROM USERS as u inner join user_has_roles as uhr on u.id=uhr.id_user
                 inner join roles r on uhr.id_rol=r.id 
WHERE u.ID = $1
group by u.id
    `
    return db.oneOrNone(sql, id);
}
User.findById = (id, callback) => {
    const sql= `
        SELECT ID, EMAIL, NAME, LASTNAME, IMAGE, PHONE, PASSWORD, SESSION_TOKEN
          FROM USERS
        WHERE ID = $1
    `
    return db.oneOrNone(sql, id).then(user => {callback(null, user)})
}
User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex')
    if (myPasswordHashed === hash) {
        return true
    }
    return false
}
User.update = (user) => {
    const sql = ` 
    UPDATE USERS SET NAME = $2, LASTNAME=$3, PHONE=$4, IMAGE= $5, UPDATE_AT=$6
    WHERE ID=$1 
    `;
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ])
}
User.updateToken = (id, token) => {
    const sql = ` 
    UPDATE USERS SET SESSION_TOKEN= $2
    WHERE ID=$1 
    `;
    return db.none(sql, [
        id,
        token
    ])
}
User.updateNotificationToken = (id, token) => {
    const sql = ` 
    UPDATE USERS SET NOTIFICATION_TOKEN= $2
    WHERE ID=$1 
    `;
    return db.none(sql, [
        id,
        token
    ])
}

module.exports=User