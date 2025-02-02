//const { json } = require('express')
const User = require('../models/user')
const Rol = require('../models/rol')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
//const { json } = require('express')
//const { storage } = require('firebase-admin')
const storage = require('../utils/cloud_storage')
const { findByDeliveryMen, getAdminsNotificationTokens } = require('../models/user')

module.exports = {
    async getAll(req,res, next){
        try {
            const data= await User.getAll()
            //console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario.'
            })
        }
    },
    async findById(req,res, next){
        try {
            const id = await req.params.id
            const data= await User.findByUserId(id)
            //console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por id.'
            })
        }
    },
    async findByDeliveryMen(req,res, next){
        try {
            
            const data= await User.findByDeliveryMen()
            console.log(`Repartidores: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener repartidores.'
            })
        }
    },
    async getAdminsNotificationTokens(req,res, next){
        try {
            
            const data= await User.getAdminsNotificationTokens()
            let tokens =[];
            data.forEach(d => {
                tokens.push(d.notification_token);
            })
            console.log(`Tokens -------> : ${tokens}`)
            return res.status('201').json(tokens)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener repartidores.'
            })
        }
    },
    async register(req, res, next){
        try {
            const user= req.body
            const data = await User.create(user)

            await Rol.create(data.id, 1)//rol por defecto (cliente)

            return res.status(201).json({
            success: true,
            message: 'El registro se realizo correctamente, iniciar sesion',
            data: data.id
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al registrar al usuario.',
                error: error
            })
        }
    },
    async updateNotificationToken(req, res, next){
        try {
            const body= req.body
            console.log('INFO NOTIFICACIONES: ',body)
            await User.updateNotificationToken(body.id, body.notification_token)

            return res.status(201).json({
                success: true,
                message: 'El token de notificaciones se ha almacenado correctamente'
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Hubo un error al tratar de actualizar el token del usuario',
                error: error
            })
        }
    },
    async registerWithImage(req, res, next){
        try {
            const user= JSON.parse(req.body.user)
            const files = req.files
            if (files.length>0) {
                const pathImage = `image_${Date.now()}` //nombre del archivo
                const url= await storage(files[0], pathImage)

                if (url != undefined && url != null) {
                    user.image=url
                }
            }
            const data = await User.create(user)
            await Rol.create(data.id, 1)//rol por defecto (cliente)

            return res.status(201).json({
            success: true,
            message: 'El registro se realizo correctamente, iniciar sesion',
            data: data.id
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al registrar al usuario.',
                error: error
            })
        }
    },
    async update(req, res, next){
        try {
            const user= JSON.parse(req.body.user)
            const files = req.files
            if (files.length>0) {
                const pathImage = `image_${Date.now()}` //nombre del archivo
                const url= await storage(files[0], pathImage)

                if (url != undefined && url != null) {
                    user.image=url
                }
            }
            await User.update(user)

            return res.status(201).json({
            success: true,
            message: 'Los datos se actualizaron correctamente.'
        })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501),json({
                success: false,
                message: 'Error al actualizar al usuario.',
                error: error
            })
        }
    },
    async login(req, res, next){
        try {
            const email=req.body.email
            const password=req.body.password
            const myUser = await User.findByEmail(email)
            
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'EL Email no fue encontrado.'
                })
            }
            if (User.isPasswordMatched(password, myUser.password)) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey,{
                    expiresIn: (365*60*60*24)//1 hora
                    //expiresIn: (60*5) //5 min
                })
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone:myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }
                await User.updateToken(myUser.id, `JWT ${token}`)
                return res.status(201).json({
                    success: true,
                    message:`Bienvenido ${myUser.name}`,
                    data: data
                })
            }
            else {
                return res.status(201).json({
                    success: true,
                    message: 'La contraseña es incorrecta.',
                    data: data
                })
            }
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al realizar login.',
                error: error
            })
        }    
    },
    async logout(req, res, next){
        try {
            const id = req.body.id
            await User.updateToken(id, null)
            return res.status(201).json({
                success: true,
                message: 'LA SESION HA EXPIRADO.'
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al cerrar sesion.',
                error: error
            })
        }    
    }
}