const slugify=require('slugify');
const Brand = require("../models/brandModel")
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middleWares/uploadImageMiddleware');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

//upload a single image
const uploadBrandImage=uploadSingleImage('image');

//image processing
const resizeImage=asyncHandler(async function (req,res,next){
    if(req.file){
        const filename=`brand=${uuidv4()}-${Date.now()}.jpeg`;
        // Use cloudinary.uploader.upload instead of cloudinary.v2.uploader.upload
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                public_id: filename,
                
                folder: 'brands', // Optional: specify a folder in Cloudinary
                format: 'png', // Optional: specify the desired format
                transformation: [
                    { quality: '70' },
                ],
                },
                (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
            );
            // Pipe the buffer into the upload stream
            uploadStream.end(req.file.buffer);
        });
        // Save Cloudinary URL to db
        req.body.image = result.secure_url;
        // await sharp(req.file.buffer).toFormat('png').png({quality:70}).toFile(`uploads/brands/${filename}`)
        // //save image to db
        // req.body.image=filename;
    }
    next();
})


const applyBrandSlugify=(req,res,next) => {
    if(req.body.name){
        req.body.slug=slugify(req.body.name);
    }
    next();
}

//@desc     Get List Of brands
//@route    GET /api/v1/brands
//@access   Public
const getBrands=factory.getAll(Brand,"brands")

//@desc     Get Specific brand by id
//@route    GET /api/v1/brands/:id
//@access   Public
const getBrand=factory.getOne(Brand)

//@desc     Create brand
//@route    POST /api/v1/brands
//@access   Private
const createBrand= factory.createOne(Brand)

//@desc     Update Specific brand
//@route    PUT /api/v1/brands/:id
//@access   Private
const updateBrand=factory.updateOne(Brand);


//@desc     Delete Specific brand
//@route    DELETE /api/v1/brands/:id
//@access   Private
const deleteBrand=factory.deleteOne(Brand) 


module.exports = {
    getBrands,
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand,
    applyBrandSlugify,
    uploadBrandImage,
    resizeImage
}