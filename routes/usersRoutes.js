const passport = require('passport')
const UsersController=require('../controllers/usersController')

module.exports = (app, upload) => {
    //traer datos
    app.get('/api/users/getAll',UsersController.getAll)
    app.get('/api/users/findByID/:id', passport.authenticate('jwt', {session:false}), UsersController.findById)

    //guardar datos
    //app.post('/api/users/create',upload.array('image',1), UsersController.register)
    app.post('/api/users/create',upload.array('image',1), UsersController.registerWithImage)
    app.post('/api/users/login', UsersController.login)
    app.post('/api/users/logout', UsersController.logout)
    //actualizar Datos
    app.put('/api/users/update',upload.array('image',1),passport.authenticate('jwt', {session:false}), UsersController.update)
}