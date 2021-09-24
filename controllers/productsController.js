const Product = require('../models/product')
const storage = require('../utils/cloud_storage')
const asyncForEach = require('../utils/async_foreach')

module.exports = {
    async findByCategory(req, res, next){
        try {
            const id_category= req.params.id_category;//cliente
            const data = await Product.findByCategory(id_category);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`)
                return res.status(501).json({
                    message: `Error al mostrar el producto por categoria`,
                    success: false,
                    error: error
                })
        }
    },
    async findByCategoryAndProductName(req, res, next){
        try {
            const id_category= req.params.id_category;//cliente
            const product_name= req.params.product_name;//producto
            const data = await Product.findByCategoryAndProductName(id_category, product_name);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`)
                return res.status(501).json({
                    message: `Error al mostrar el producto por categoria`,
                    success: false,
                    error: error
                })
        }
    },
    async create(req, res, next) {
        let product = JSON.parse(req.body.product)
        
        console.log(`product: ${JSON.stringify(product)}`)
        
        const files = req.files;
        let inserts = 0
        
        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen.',
                success: false
            })
        } else {
            try {
                const data = await Product.create(product)//almacenando la informacion
                
                product.id=data.id
                
                const start = async () => {
                    
                    await asyncForEach(files, async(file) => {
                        const pathImage =`image_${Date.now()}`
                        
                        const url = await storage(file, pathImage)
                        
                        if(url !== undefined && url !== null){
                            if (inserts==0) { //IMAGE 1
                                product.image1 = url
                            }
                            else if (inserts == 1) { //imagen2
                                product.image2 = url
                            }
                            else if (inserts == 2) { //imagen2
                                product.image3 = url
                            }
                        }
                        await Product.update(product)
                        inserts = inserts + 1
                        if (inserts === files.length) {
                            return res.status(201).json({
                                message: 'El producto se ha registrado correctamente.',
                                success: true
                            })
                        }
                    })
                }
                start()
            } catch (error) {
                console.log(`Error: ${error}`)
                return res.status(501).json({
                    message: `Error al registrar el Producto ${error}`,
                    success: false,
                    error: error
                })
            }
        }
    }
}