const mercadopago = require('mercadopago')
const Order = require('../models/order')
const OrderHasProduct = require('../models/order_has_products')
const User = require('../models/user')

mercadopago.configure({
    sandbox: true,
    access_token: 'TEST-1844554889341512-091715-42a964c6db346b8309e3901515f9dcee-578676229'
})

module.exports = {
    //generar pago para tarjeta de credito
    async createPaymentCreditCart(req, res, next){
        let payment = req.body //requerir datos del pago viene en req.body viene del flutter
        const payment_data = {
            description: payment.description,
            transaction_amount: payment.transaction_amount,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            token: payment.token,
            issuer_id: payment.issuer_id,
            payer: {
                email: payment.payer.email,
                identification: {
                    type: payment.payer.identification.type,
                    number: payment.payer.identification.number
                }
            }
        }
        const data = await mercadopago.payment.create(payment_data).catch((err) => {
            console.log(err)
            return res.status(501).json({
                message: 'Error al crear el pago',
                success: false,
                error: err
            })
        })
        if (data) {
            console.log('Si hay datos correctos',data.response)
            if (data!==undefined) {
                const payment_type_id = module.exports.validatePaymentMethod(payment.payment_type_id)
                payment.id_payment_method = payment_type_id

                let order = payment.order
                order.status='PAGADO'
                const dataPago = await Order.create(order)

            //recorrer todos los productos agregados a la orden
                for (const product of order.products) {
                await OrderHasProduct.create(dataPago.id, product.id, product.quantity);
                }

                return res.status(201).json(data.response)
            }
        }else{
            return res.status(501).json({
                message: 'Error en algun dato de la peticion',
                success: false
            })
        }
    },
    validatePaymentMethod(status){
        if (status=='credit_cart') {
            status=1
        }
        if (status=='bank_transfer') {
            status=2
        }
        if (status=='ticket') {
            status=3
        }
        if (status=='upon_delivery') {
            status=4
        }
        return status
    }
}