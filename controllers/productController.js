const slugify=require('slugify');
const Product = require("../models/productModel");
const factory=require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadMixOfImages } = require('../middleWares/uploadImageMiddleware');



const uploadProductImages=uploadMixOfImages([
        {name: `imageCover`, maxCount:1},
        {name: `images`,maxCount:5}
    ])


const resizeProductImages=asyncHandler(async(req,res,next)=>{
        if(req.files.imageCover){
            const imageCoverfilename=`product=${uuidv4()}-${Date.now()}-cover.jpeg`;
            await sharp(req.files.imageCover[0].buffer).toFormat('png').png({quality:70}).toFile(`uploads/products/${imageCoverfilename}`)
            //save image to db
            req.body.imageCover=process.env.BASE_URL+'/uploads'+'products/'+imageCoverfilename;
        }
        if(req.files.images){
            req.body.images=[]
        await Promise.all(
                req.files.images.map(async(image,index)=>{
                    const imageName=`product=${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
                    await sharp(image.buffer).resize(2000,2000).toFormat('png').png({quality:70}).toFile(`uploads/products/${imageName}`)
                    //save image to db
                    req.body.images.push(process.env.BASE_URL+'/'+'products/'+imageName);
                })
            )
        }
        next();
    })


const applyProductSlugify=(req,res,next) => {
    if(req.body.title){
    req.body.slug=slugify(req.body.title);
    }
    next();
}

//@desc     Get List Of Products
//@route    GET /api/v1/products
//@access   Public
const getProducts=factory.getAll(Product,"Products")

//@desc     Get Specific Product by id
//@route    GET /api/v1/products/:id
//@access   Public
const getProduct=factory.getOne(Product, 'reviews')

//@desc     Create Product
//@route    POST /api/v1/products
//@access   Private
const createProduct = factory.createOne(Product)

//@desc     Update Specific Product
//@route    PUT /api/v1/products/:id
//@access   Private
const updateProduct=factory.updateOne(Product)


//@desc     Delete Specific Product
//@route    DELETE /api/v1/products/:id
//@access   Private
const deleteProduct=factory.deleteOne(Product) 

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    applyProductSlugify,
    uploadProductImages,
    resizeProductImages
}