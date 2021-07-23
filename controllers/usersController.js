//const { json } = require('express')
const User = require('../models/user')
const Rol = require('../models/rol')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
//const { json } = require('express')
//const { storage } = require('firebase-admin')
const storage = require('../utils/cloud_storage')

module.exports = {
    async getAll(req,res, next){
        try {
            const data= await User.getAll()
            console.log(`Usuarios: ${data}`)
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
            console.log(`Usuarios: ${data}`)
            return res.status('201').json(data)
        } catch (error) {
            console.log(error)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por id.'
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
                    // expiresIn: (60*60*24)//1 hora
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
                return res.status(201).json({
                    success: true,
                    message:'Bienvenido...',
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
    }
}