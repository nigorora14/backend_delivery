/*
const: constantes
let: variables
*/
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const logger= require('morgan')
const cors= require('cors')
const multer = require('multer')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const passport = require('passport')
const io = require('socket.io')(server)
const mercadopago = require('mercadopago')
/*sockets*/
const orderDeliverySocket = require('./sockets/orders_delivery_sockets')

const users = require('./routes/usersRoutes')
const categories = require('./routes/categoriesRoutes')
const products = require('./routes/productsRoutes')
const address = require('./routes/addressRoutes')
const order = require('./routes/ordersRoutes')
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes')

/*MERCADO PAGO CONFIGURACION*/
mercadopago.configure({
    access_token:'TEST-1844554889341512-091715-42a964c6db346b8309e3901515f9dcee-578676229'
})

/*FINN MERCADO PAGO CONFIGURACION*/

/*iniciar firebase*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const upload = multer ({
    storage: multer.memoryStorage()
})


/*Rutas*/
const port = process.env.PORT || 3000
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.disable('x-powered-by')
app.set('port', port)

//LLamar al sockets
orderDeliverySocket(io)
/*
llamando a las rutas
*/
users(app, upload)
categories(app)
address(app)
order(app)
products(app, upload)
mercadoPagoRoutes(app)

server.listen(port,'ec2-52-204-14-80.compute-1.amazonaws.com', function(){
//server.listen(port,'192.168.3.106'||'localhost', function(){
    console.log('App '+process.pid+' iniciada...')
    console.log('Port '+port+' iniciada...')
})

app.get('/',(req, res) => {
    res.send('ruta raiz del backend')
})
//error handler
app.use((err,req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})

module.exports = {
    app: app,
    server: server
}

//200 - es una respuesta exitosa
//400 - significa que la url no existe
//500 - error interno del servidor