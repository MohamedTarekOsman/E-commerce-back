const Joi = require('joi');
const User =require('../../models/userModel')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const isId = (value, helpers) => {
    if (typeof(value)!=='string'||value.length!==24) {
        return helpers.error('Invalid id format'); 
    }
    return value;
};



const createUserValidator=(req, res, next)=> {
    const schema = Joi.object({
        name:Joi.string().min(3).max(32).required().messages({
            'string.base': 'name must be a string.',
            'string.min': 'name must be at least 2 characters long.',
            'string.max': 'name cannot exceed 32 characters.',
            'any.required': 'name is required.',
            }),
        email:Joi.string().email().required().messages({
            'email.base': 'invalid email format',
            'any.required': 'email is required.',
            }),
        password:Joi.string().required().min(8).messages({
            'string.min': 'password  must be at least 8 characters long.',
            'any.required': 'password is required.',
        }),
        phone:Joi.string().pattern(/^[0-9]{11}$/).message('invalid phone number format'),
    })
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    }
    const result = schema.validate(req.body, options)
    if(req.body.password !== req.body.passwordConfirm) {
        throw new Error(`Invalid password: ${req.body.password}`)
    }
    if (result.error) {
        return res.status(400).json(result.error.details)
    } else {
        next()
    }
}
const getUserValidator = (req, res, next) => {
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
const updateUserValidator = (req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
        name:Joi.string().min(3).max(32).required().messages({
            'string.base': 'name must be a string.',
            'string.min': 'name must be at least 2 characters long.',
            'string.max': 'name cannot exceed 32 characters.',
            'any.required': 'name is required.',
            }),
        email:Joi.string().email().required().messages({
            'email.base': 'invalid email format',
            'any.required': 'email is required.',
            }),
        phone:Joi.string().pattern(/^[0-9]{11}$/).message('invalid phone number format'),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const validationInput = { id: req.params.id, ...req.body };
    const result = schema.validate(validationInput, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};


const updateUserValidatorForLogged = (req, res, next) => {
    const schema = Joi.object({
        name:Joi.string().min(3).max(32).required().messages({
            'string.base': 'name must be a string.',
            'string.min': 'name must be at least 2 characters long.',
            'string.max': 'name cannot exceed 32 characters.',
            'any.required': 'name is required.',
            }),
        email:Joi.string().email().required().messages({
            'email.base': 'invalid email format',
            'any.required': 'email is required.',
            }),
        phone:Joi.string().pattern(/^[0-9]{11}$/).message('invalid phone number format'),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const result = schema.validate(req.body, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};
const changeUserPasswordValidator=async(req, res, next)=>{ 
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
        return res.status(400).json(`Invalid user ID: ${req.params.id}`);
    }
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
        password:Joi.string().required().min(8).messages({
            'string.min': 'password  must be at least 8 characters long.',
            'any.required': 'password is required.',
        }),
        currentPassword: Joi.string().required().messages({
            'string.min': 'currentPassword  must be at least 8 characters long.',
            'any.required': 'currentPassword is required.',
        }),
        passwordConfirm: Joi.string().required().messages({
            'string.min': 'Confirm password  must be at least 8 characters long.',
            'any.required': 'Confirm password is required.',
        }),
    })
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    }
    const validationInput = { id: req.params.id, ...req.body };
    const result = schema.validate(validationInput, options);
    const user=await User.findById(req.params.id)
    if(!user){
        return res.status(400).json(`there is no user with id ${req.params.id}`)
    }
    const isCorrectPassword=await bcrypt.compare(req.body.currentPassword,user.password)
    console.log(isCorrectPassword)
    if(!isCorrectPassword){
        return res.status(400).json(`Incorrect currentPassword`)
    }
    if(req.body.password !== req.body.passwordConfirm) {
        return res.status(400).json(`Invalid confirm password: ${req.body.passwordConfirm}`)
    }
    if (result.error) {
        return res.status(400).json(result.error.details)
    } else {
        next()
    }
}
const changeUserPasswordValidatorForLogged=async(req, res, next)=>{ 
    const schema = Joi.object({
        password:Joi.string().required().min(8).messages({
            'string.min': 'password  must be at least 8 characters long.',
            'any.required': 'password is required.',
        }),
        currentPassword: Joi.string().required().messages({
            'string.min': 'currentPassword  must be at least 8 characters long.',
            'any.required': 'currentPassword is required.',
        }),
        passwordConfirm: Joi.string().required().messages({
            'string.min': 'Confirm password  must be at least 8 characters long.',
            'any.required': 'Confirm password is required.',
        }),
    })
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    }
    const result = schema.validate(req.body,options);
    const user=await User.findById(req.user._id)
    if(!user){
        return res.status(400).json(`there is no user with id ${req.user._id}`)
    }
    const isCorrectPassword=await bcrypt.compare(req.body.currentPassword,user.password)
    if(!isCorrectPassword){
        return res.status(400).json(`Incorrect currentPassword`)
    }
    if(req.body.password !== req.body.passwordConfirm) {
        return res.status(400).json(`Invalid confirm password: ${req.body.passwordConfirm}`)
    }
    if (result.error) {
        return res.status(400).json(result.error.details)
    } else {
        next()
    }
}
const deleteUserValidator = (req, res, next) => {
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
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    changeUserPasswordValidatorForLogged,
    updateUserValidatorForLogged
}