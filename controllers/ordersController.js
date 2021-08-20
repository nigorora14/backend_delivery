const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {

    async create(req, res, next) {
        try {
            const order = req.body;
            const data = await Order.create(order)
            //recorrer todos los productos agregados a la orden
            for (const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success : true,
                message : 'La Orden se creo correctamente.',
                data : data.id
            })

        } catch (error) {
            console.log(`Error en create Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error creado la Orden',
                error : error
            })
        }
    }
}