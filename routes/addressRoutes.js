const AddressController = require('../controllers/addressController')
const passport = require('passport')

module.exports = (app) => {
    //GET
  //  app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), CategoriesController.getAll)
    //POST
    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), AddressController.create)
}