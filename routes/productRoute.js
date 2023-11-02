const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, applyProductSlugify, uploadProductImages, resizeProductImages } = require('../controllers/productController');
const { getProductValidator, createProductValidator, updateProductValidator, deleteProductValidator, validationChildrenForCreateProduct } = require('../utilities/validators/productValidator');
const authController=require('../controllers/authController')
const router = express.Router();
const reviewRoute =require('./reviewRoute')

//nested route
router.use('/:productId/reviews',reviewRoute )


router.route('/')
.get(getProducts)
.post(uploadProductImages,resizeProductImages,createProductValidator,applyProductSlugify,validationChildrenForCreateProduct,createProduct)


router.route('/:id')
.get(getProductValidator,getProduct)
.put(authController.protect,
    authController.allowedTo('admin','manager'),uploadProductImages,resizeProductImages,updateProductValidator,applyProductSlugify,updateProduct)
.delete(authController.protect,
    authController.allowedTo('admin'),deleteProductValidator,deleteProduct)




module.exports = router;