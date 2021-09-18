const OrdersController = require('../controllers/ordersController')
const passport = require('passport')

module.exports = (app) => {
    //GET
    app.get('/api/order/findByStatus/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByStatus)
    app.get('/api/order/findByDeliveryAndStatus/:id_delivery/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByDeliveryAndStatus)
    app.get('/api/order/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByClientAndStatus)
    
    //POST
    app.post('/api/order/create', passport.authenticate('jwt', {session: false}), OrdersController.create)

    //PUT
    app.put('/api/order/updateToDispatched', passport.authenticate('jwt', {session: false}), OrdersController.updateToDispatched)
    app.put('/api/order/updateToOnTheWay', passport.authenticate('jwt', {session: false}), OrdersController.updateToOnTheWay)
    app.put('/api/order/updateToDelivered', passport.authenticate('jwt', {session: false}), OrdersController.updateToDelivered)
    app.put('/api/order/updateLatLng', passport.authenticate('jwt', {session: false}), OrdersController.updateLatLng)
}