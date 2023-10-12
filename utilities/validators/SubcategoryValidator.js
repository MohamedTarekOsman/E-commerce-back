const Joi = require('joi');

const isId = (value, helpers) => {
    if (typeof(value)!=='string'||value.length!==24) {
        return helpers.error('Invalid id format'); 
    }
    return value;
};



const createsubCategoryValidator=(req, res, next)=> {
    const schema = Joi.object({
        name:Joi.string().min(2).max(32).required().messages({
            'string.base': 'name must be a string.',
            'string.min': 'name must be at least 2 characters long.',
            'string.max': 'name cannot exceed 32 characters.',
            'any.required': 'name is required.',
            }),

        category:Joi.string().custom(isId,'custom validation').min(2).max(32).required().messages({
            'string.base': 'category must be a string.',
            'string.min': 'category must be at least 2 characters long.',
            'string.max': 'category cannot exceed 32 characters.',
            'any.required': 'category is required.',
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
const getsubCategoryValidator = (req, res, next) => {
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
const updatesubCategoryValidator = (req, res, next) => {
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
const deletesubCategoryValidator = (req, res, next) => {
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
    createsubCategoryValidator,
    getsubCategoryValidator,
    updatesubCategoryValidator,
    deletesubCategoryValidator
}