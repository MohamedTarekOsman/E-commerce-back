const slugify=require('slugify');
const subCategoryModel = require("../models/subCategoryModel")
const factory=require('./handlersFactory');

//nested route
const setCategoryIdtobody =(req,res,next)=>{
    if (!req.body.category){
        req.body.category =req.params.categoryId
    }
    next()
}
const applySubCategorySlugify=(req,res,next) => {
    if(req.body.name){
        req.body.slug=slugify(req.body.name);
    }
    next();
}
const createFilterObj=(req,res,next)=>{
    let filterObj={};
    if(req.params.categoryId){
        filterObj={category:req.params.categoryId}
    }
    req.filterObj=filterObj;
    next();
}
//@desc     Create subCategory
//@route    POST /api/v1/subcategories
//@access   Private
const createSubCategory = factory.createOne(subCategoryModel)


//@desc     Get List Of subCategories
//@route    GET /api/v1/subcategories
//@access   Public
const getsubCategories=factory.getAll(subCategoryModel,"subCategories")

//@desc     Get Specific subCategory by id
//@route    GET /api/v1/subcategories/:id
//@access   Public
const getsubCategory=factory.getOne(subCategoryModel)


//@desc     Update Specific subCategory
//@route    PUT /api/v1/subcategories/:id
//@access   Private
const updatesubCategory=factory.updateOne(subCategoryModel)

//@desc     Delete Specific subCategory
//@route    DELETE /api/v1/subcategories/:id
//@access   Private
const deletesubCategory=factory.deleteOne(subCategoryModel) 

module.exports = {
    createSubCategory,
    getsubCategories,
    getsubCategory,
    updatesubCategory,
    deletesubCategory,
    setCategoryIdtobody,
    applySubCategorySlugify,
    createFilterObj
}