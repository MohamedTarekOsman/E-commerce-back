const slugify=require('slugify');
const CategoryModel = require("../models/categoryModel")
const { v4: uuidv4 } = require('uuid');
const factory=require('./handlersFactory');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middleWares/uploadImageMiddleware');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

//upload a single image
const uploadCategoryImage=uploadSingleImage('image');



//image processing
const resizeImage=asyncHandler(async function (req,res,next){
    if(req.file){
        const filename=`category=${uuidv4()}-${Date.now()}.jpeg`;
            // Use cloudinary.uploader.upload instead of cloudinary.v2.uploader.upload
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                    public_id: filename,
                    
                    folder: 'categories', // Optional: specify a folder in Cloudinary
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
        // await sharp(req.file.buffer).toFormat('png').png({quality:70}).toFile(`uploads/categories/${filename}`)
        //save image to db 
        //req.body.image=filename;
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