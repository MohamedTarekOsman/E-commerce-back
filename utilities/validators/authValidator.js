const Joi = require('joi');

const signUpValidator=(req, res, next)=> {
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
    })
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    }
    const result = schema.validate(req.body, options)
    if(req.body.password !== req.body.passwordConfirm) {
        throw new Error(`Invalid password confirmation: ${req.body.passwordConfirm}`)
    }
    if (result.error) {
        return res.status(400).json(result.error.details)
    } else {
        next()
    }
}

const logInValidator=(req, res, next)=> {
    const schema = Joi.object({
        email:Joi.string().email().required().messages({
            'email.base': 'invalid email format',
            'any.required': 'email is required.',
            }),
        password:Joi.string().required().min(8).messages({
            'string.min': 'password  must be at least 8 characters long.',
            'any.required': 'password is required.',
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
module.exports ={
    signUpValidator,
    logInValidator
}