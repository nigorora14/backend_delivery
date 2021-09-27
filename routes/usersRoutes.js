const passport = require('passport')
const UsersController=require('../controllers/usersController')

module.exports = (app, upload) => {
    //traer datos
    app.get('/api/users/getAll',UsersController.getAll)
    app.get('/api/users/findByID/:id', passport.authenticate('jwt', {session:false}), UsersController.findById)
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', {session:false}), UsersController.findByDeliveryMen)
    app.get('/api/users/getAdminsNotificationTokens', passport.authenticate('jwt', {session:false}), UsersController.getAdminsNotificationTokens)

    //guardar datos
    app.post('/api/users/create',upload.array('image',1), UsersController.registerWithImage)
    app.post('/api/users/login', UsersController.login)
    app.post('/api/users/logout', UsersController.logout)

    //actualizar Datos
    app.put('/api/users/update',upload.array('image',1),passport.authenticate('jwt', {session:false}), UsersController.update)
    app.put('/api/users/updateNotificationToken',passport.authenticate('jwt', {session:false}), UsersController.updateNotificationToken)
}