const Product = require('../models/product')
const storage = require('../utils/cloud_storage')

module.exports = {
    async create(req, res, next) {
        let product = JSON.parse(req.body.product)
        const files = req.files;
        let insert = 0

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

                        if(url != undefined && url !== null){
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
                    message: `Error al registrar el roducto ${error}`,
                    success: false,
                    error: error
                })
            }
        }
    }
}