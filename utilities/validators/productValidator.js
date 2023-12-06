const Joi = require('joi');
const CategoryModel = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');
const ApiError = require('../ApiError');

const isId = (value, helpers) => {
    if (typeof(value)!=='string'||value.length!==24) {
        return helpers.error('category.notFound'); 
    }
    return value;
};

const validationChildrenForCreateProduct =async(req, res,next) => { 
    const category=await CategoryModel.findById(req.body.category)
    const subcategory=await SubCategory.find({})
    const subcategorybelongsTo=await SubCategory.find({category:req.body.category})
    const subcategoryIds = subcategory.map(subcategory => subcategory._id.toString());
    const subcategorypartofCategory = subcategorybelongsTo.map(subcategory => subcategory._id.toString());
    if(req.body.priceAfterDiscount){
        if(req.body.priceAfterDiscount>req.body.price){
            return next(new ApiError(`PriceAfterDiscount must be lower than Price`,404));
        }
    }
    if(Array.isArray(req.body.subCategory)){
        const subCategoryispartofDB=req.body.subCategory.every(item => subcategoryIds.includes(item));
        const subCategoryispartofCategory=req.body.subCategory.every(item => subcategorypartofCategory.includes(item));
        if(!subCategoryispartofDB){
            return next(new ApiError(`your subcategoryids not exists`,404));
        }
        if(!subCategoryispartofCategory){
            return next(new ApiError(`your subcategory not exists in this category`,404));
        }
    }
    if(!category){
        return next(new ApiError(`ID is not Found`,404));
    }
    next()
}
const createProductValidator=(req, res, next)=> {
    const schema = Joi.object({
        title:Joi.string().min(2).max(100).required().messages({
            'string.base': 'name must be a string.',
            'string.min': 'name must be at least 2 characters long.',
            'string.max': 'name cannot exceed 100 characters.',
            'any.required': 'name is required.',
            }),
        description: Joi.string().max(2000).required().messages({
            'string.max': 'description cannot exceed 2000 characters.',
            'any.required': 'description is required.',
        }),
        quantity: Joi.number().required().messages({
            'number.base': 'Quantity must be a number.',
            'any.required': 'Quantity is required.',
        }),
        sold: Joi.number().messages({
            'number.base': 'Sold Items must be a number.',
        }),
        price: Joi.number().max(1000000000).required().messages({
            'number.max': 'Price cannot exceed 32.',
            'any.required': 'Price is required.',
        }),
        priceAfterDiscount: Joi.number().precision(2).messages({
            'number.base': 'priceAfterDiscount must be a number.',
        }),
        colors: Joi.array().items(Joi.string()).single().messages({
            'array.base': 'colors should be array of string',
        }),
        imageCover: Joi.string().required().messages({
            'any.required': 'imageCover is required.',
        }),
        images: Joi.array().items(Joi.string()).single().messages({
            'array.base': 'images should be array',
        }),
        category: Joi.string().custom(isId,'validation id').required()
        .messages({
            'any.required': 'Category is required.',
            'category.notFound': 'Invalied ID Format.',
        }),
        subCategory: Joi.array().items(Joi.string()).single().messages({
            'array.base': 'subCategory should be array of string',
        }),
        brand: Joi.any().custom(isId,'validation id'),
        ratingsAverage: Joi.number().precision(1).max(5).min(1).messages({
            'number.max': 'ratingsAverage must be above or equal 1.0.',
            'number.min': 'ratingsAverage  must be above or equal 5.0.',
            'any.required': 'ratingsAverage is required.',
        }),
        ratingsQuantity: Joi.number().messages({
            'number.base': 'ratingsQuantity must be a number.',
        }),
    })
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    }
    const result = schema.validate(req.body, options)
    if (result.error) {
        return res.status(400).json(result.error.details)
    } else {
        next()
    }
}
const getProductValidator = (req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const result = schema.validate({ id }, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};
const updateProductValidator = (req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const result = schema.validate({ id }, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};
const deleteProductValidator = (req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const result = schema.validate({ id }, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};
module.exports ={
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
    validationChildrenForCreateProduct
}