const express = require('express')
const passport = require('passport')

const ProductsService = require('../../services/products')

const router = express.Router()

const { 
        productIdSchema, 
        productTagSchema, 
        createProductSchema, 
        updateProductSchema
    } = require('../../utils/schemas/products')

const validation = require('../../utils/middlewares/validationHandler')

//JWT strategy

require("../../utils/auth/strategies/jwt")

//Cache
const cacheResponse = require('../../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time')


const productService = new ProductsService()


router.get('/', async (req, res, next)=>{
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query

    try {
        const products = await productService.getProducts({ tags })
    
        res.status(200).json({
            data: products,
            message: 'products listed'
        })
        
    } catch (error) {
        next(error)
    }
})

router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params

    try {
        const product =  await productService.getProduct({productId})
        res.status(200).json({
            data: product,
            message: 'products retrieve'
        })
        
    } catch (error) {
        next(error)
    }
    
})

router.post('/', validation(createProductSchema), async (req, res, next) => {
    const { body: product } = req
    
    try {
        const Newproduct = await productService.createProduct({ product })
        res.status(201).json({
            data: Newproduct,
            message: 'product created'
        })            
    } catch (error) {
        next(error)
    }
})

router.put('/:productId',
     passport.authenticate("jwt",{ session: false}),
     validation({productId: productIdSchema}, "params"), 
     validation(updateProductSchema), async (req, res, next) => {
    const { productId } = req.params
    const { body: product } = req

    try {
        const updatedProduct = await productService.updateProduct({ productId, product })
        
        res.status(200).json({
            data: updatedProduct,
            message: 'products updated'
        })
    } catch (error) {
        next(error)
    }
})

router.delete('/:productId', 
    passport.authenticate("jwt",{ session: false}),
    async (req, res, next) => {
    const { productId } = req.params
    
    try {
        const product = productService.deleteProduct({ productId })
    
        res.status(200).json({
            data: product,
            message: 'products deleted'
        })
        
    } catch (error) {
        next(error)
    }
})

module.exports = router;