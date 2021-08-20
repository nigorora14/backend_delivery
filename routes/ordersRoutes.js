const OrdersController = require('../controllers/ordersController')
const passport = require('passport')

module.exports = (app) => {
    //GET
    //app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressController.findByUser)
    //POST
    app.post('/api/order/create', passport.authenticate('jwt', {session: false}), OrdersController.create)
}