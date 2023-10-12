const express = require('express');
const { createsubCategoryValidator, getsubCategoryValidator, updatesubCategoryValidator, deletesubCategoryValidator } = require('../utilities/validators/SubcategoryValidator');
const { createSubCategory,getsubCategories,getsubCategory, updatesubCategory, deletesubCategory, setCategoryIdtobody, applySubCategorySlugify, createFilterObj } = require('../controllers/subCategorycontroller');
const authController=require('../controllers/authController')
//mergeparams : Allows us to access parameters in other routers
//ex: we need to access categoryId from category router
const router = express.Router({mergeParams:true});

router.route('/')
.post(authController.protect,
    authController.allowedTo('admin','manager'),setCategoryIdtobody,createsubCategoryValidator,applySubCategorySlugify,createSubCategory)
.get(createFilterObj,getsubCategories)


router.route('/:id')
.get(getsubCategoryValidator,getsubCategory)
.put(authController.protect,
    authController.allowedTo('admin','manager'),updatesubCategoryValidator,applySubCategorySlugify,updatesubCategory)
.delete(authController.protect,
    authController.allowedTo('admin'),deletesubCategoryValidator,deletesubCategory)

module.exports = router;