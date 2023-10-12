const express = require('express');
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand, applyBrandSlugify, uploadBrandImage, resizeImage } = require('../controllers/brandcontroller');
const { getBrandValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utilities/validators/brandValidator');
const authController=require('../controllers/authController')
const router = express.Router();



router.route('/')
.get(getBrands)
.post(authController.protect,
    authController.allowedTo('admin','manager'),uploadBrandImage,resizeImage,createBrandValidator ,applyBrandSlugify,createBrand)


router.route('/:id')
.get(getBrandValidator,getBrand)
.put(authController.protect,
    authController.allowedTo('admin','manager'),uploadBrandImage,resizeImage,updateBrandValidator,applyBrandSlugify,updateBrand)
.delete(authController.protect,
    authController.allowedTo('admin'),deleteBrandValidator,deleteBrand)




module.exports = router;