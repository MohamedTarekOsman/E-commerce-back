const Joi = require('joi');

const isId = (value, helpers) => {
    if (typeof(value)!=='string'||value.length!==24) {
        return helpers.error('Invalid id format'); 
    }
    return value;
};


const getcategoryValidator=(req, res, next) => {
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

const createcategoryValidator=(req, res, next)=> {
    const schema = Joi.object({
        name:Joi.string().min(2).max(32).required().messages({
            'string.base': 'name must be a string.',
            'string.min': 'name must be at least 2 characters long.',
            'string.max': 'name cannot exceed 32 characters.',
            'any.required': 'name is required.',
            }),
        Image:Joi.string()
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

const updatecategoryValidator=(req, res, next) => {
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

const deletecategoryValidator=(req, res, next) => {
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
    getcategoryValidator,
    createcategoryValidator,
    updatecategoryValidator,
    deletecategoryValidator
}