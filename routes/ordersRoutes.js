const OrdersController = require('../controllers/ordersController')
const passport = require('passport')

module.exports = (app) => {
    //GET
    app.get('/api/order/findByStatus/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByStatus)
    //POST
    app.post('/api/order/create', passport.authenticate('jwt', {session: false}), OrdersController.create)
}