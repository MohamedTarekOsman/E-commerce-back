const express = require('express');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, applyCategorySlugify, uploadCategoryImage, resizeImage } = require('../controllers/categorycontroller');
const router = express.Router();
const SubCategoryRoute = require('./SubCategoryRoute');
const { getcategoryValidator, createcategoryValidator, updatecategoryValidator, deletecategoryValidator } = require('../utilities/validators/categoryValidator');
const authController=require('../controllers/authController')

//nested route
router.use('/:categoryId/subcategrories',SubCategoryRoute )


router.route('/')
.get(getCategories)
.post(
    authController.protect,
    authController.allowedTo('admin','manager'),
    uploadCategoryImage,
    resizeImage,
    createcategoryValidator,
    applyCategorySlugify,
    createCategory
    )


router.route('/:id')
.get(getcategoryValidator,getCategory)
.put(
    authController.protect,
    authController.allowedTo('admin','manager'),
    uploadCategoryImage,resizeImage,updatecategoryValidator,applyCategorySlugify,updateCategory)
.delete(
    authController.protect,
    authController.allowedTo('admin'),
    deletecategoryValidator,deleteCategory)




module.exports = router;