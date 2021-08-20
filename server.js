/*
const: constantes
let: variables
*/
const express = require('express')
const http = require('http')
const logger= require('morgan')
const cors= require('cors')
const multer = require('multer')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const passport = require('passport')

const users = require('./routes/usersRoutes')
const categories = require('./routes/categoriesRoutes')
const products = require('./routes/productsRoutes')
const address = require('./routes/addressRoutes')
const order = require('./routes/ordersRoutes')
/*
iniciar firebase
*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const upload = multer ({
    storage: multer.memoryStorage()
})

// import logger from 'morgan'
// import cors from 'cors'
// import users from './routes/usersRoutes'

const app = express()
const server = http.createServer(app)

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

/*
llamando a las rutas
*/
users(app, upload)
categories(app)
address(app)
order(app)
products(app, upload)

server.listen(3000,'192.168.0.102' || 'localhost', function(){
    console.log('App '+process.pid+' iniciada...')
    console.log('App '+port+' iniciada...')
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