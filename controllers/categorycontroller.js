const slugify=require('slugify');
const CategoryModel = require("../models/categoryModel")
const { v4: uuidv4 } = require('uuid');
const factory=require('./handlersFactory');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middleWares/uploadImageMiddleware');


//upload a single image
const uploadCategoryImage=uploadSingleImage('image');

//image processing
const resizeImage=asyncHandler(async function (req,res,next){
    if(req.file){
        const filename=`category=${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer).resize(600,600).toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/categories/${filename}`)
        //save image to db 
        req.body.image=filename;
    }
    next();
})


const applyCategorySlugify=(req,res,next) => {
    if(req.body.name){
        req.body.slug=slugify(req.body.name);
    }
    next();
}
//@desc     Get List Of Categories
//@route    GET /api/v1/categories
//@access   Public
const getCategories=factory.getAll(CategoryModel,"categories")

//@desc     Get Specific Category by id
//@route    GET /api/v1/categories/:id
//@access   Public
const getCategory=factory.getOne(CategoryModel)

//@desc     Create Category
//@route    POST /api/v1/categories
//@access   Private
const createCategory =factory.createOne(CategoryModel)

//@desc     Update Specific Category
//@route    PUT /api/v1/categories/:id
//@access   Private
const updateCategory=factory.updateOne(CategoryModel)


//@desc     Delete Specific Category
//@route    DELETE /api/v1/categories/:id
//@access   Private
const deleteCategory=factory.deleteOne(CategoryModel) 


module.exports = {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    applyCategorySlugify,
    uploadCategoryImage,
    resizeImage
}