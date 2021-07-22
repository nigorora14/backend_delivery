const UsersController=require('../controllers/usersController')

module.exports = (app, upload) => {
    //traer datos
    app.get('/api/users/getAll',UsersController.getAll)

    //guardar datos
    //app.post('/api/users/create',upload.array('image',1), UsersController.register)
    app.post('/api/users/create',upload.array('image',1), UsersController.registerWithImage)
    app.post('/api/users/login', UsersController.login)
}