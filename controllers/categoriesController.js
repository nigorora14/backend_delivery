const Category = require('../models/category')
const { getAll } = require('../models/user')

module.exports = {
    async getAll(req, res, next){
        try {
            const data = await Category.getAll()
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las categorias',
                error: error,
                success: false
            })
        }
    },
    async create(req, res, next){
        try {
            const category = req.body
            const data = await Category.create(category)
            return res.status(201).json({
                message: 'Se creo la categoria.',
                success: true,
                data: data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                message: 'Hubo un error al crear la categoria',
                success: false,
                error: error
            })
        }
    }
}