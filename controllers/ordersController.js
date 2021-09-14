const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {
    async findByStatus(req, res, next){
        try {
            const status = req.params.status
            const data = await Order.findByStatus(status)
            console.log(`Status ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las ordenes por estado.',
                error: error,
                success: false
            })
        }
    },
    async findByDeliveryAndStatus(req, res, next){
        try {
            const id_delivery = req.params.id_delivery
            const status = req.params.status
            const data = await Order.findByDeliveryAndStatus(id_delivery, status)
            console.log(`Status delivery ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al listar las ordenes por estado.',
                error: error,
                success: false
            })
        }
    },
    async create(req, res, next) {
        try {
            let order = req.body
            order.status='PAGADO'
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
    },
    async updateToDispatched(req, res, next) {
        try {
            let order = req.body
            order.status='DESPACHADO'
            await Order.update(order)
            return res.status(201).json({
                success : true,
                message : 'La Orden se actualizo correctamente.'
            })

        } catch (error) {
            console.log(`Error en actualizar la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la Orden',
                error : error
            })
        }
    },
    async updateToOnTheWay(req, res, next) {
        try {
            let order = req.body
            order.status='EN CAMINO'
            await Order.update(order)
            return res.status(201).json({
                success : true,
                message : 'La Orden se actualizo correctamente.'
            })

        } catch (error) {
            console.log(`Error en actualizar la Order: ${error}`)
            return res.status(501).json({
                success : false,
                message : 'Hubo un error al actualizar la Orden',
                error : error
            })
        }
    }
}