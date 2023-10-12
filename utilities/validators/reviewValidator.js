const Joi = require('joi');
const Review =require('../../models/reviewModel');

const isId = (value, helpers) => {
    if (typeof(value)!=='string'||value.length!==24) {
        return helpers.error('Invalid id format'); 
    }
    return value;
};



const createReviewValidator=async(req, res, next)=> {
    const schema = Joi.object({
        title:Joi.string().messages({
            'string.base': 'name must be a string.',
            }),
        ratings:Joi.number().precision(2).min(1).max(5).required().messages({
            'number.base': 'ratings must be a number.',
            'number.precision': 'ratings must have 2 decimal places.',
            'number.min': 'ratings must be greater t han or equal to 1.',
            'number.max': 'ratings must be less than or equal to 5.',
            'any.required': 'ratings is required.'
            }),
        user: Joi.any().required(),
        product: Joi.any().required()
    })
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    }

    const review=await Review.findOne({user:req.user._id,product:req.body.product})
    if(review){
        return res.status(400).json("you can't make more than one review")
    }

    const result = schema.validate(req.body, options)
    if (result.error) {
        return res.status(400).json(result.error.details)
    } else {
        next()
    }
}
const getReviewValidator = (req, res, next) => {
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
const updateReviewValidator = async(req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const review=await Review.findById(id)
    if(!review) {
        return res.status(400).send("there is no review with this id");
    }
    if(review.user._id.toString()!==req.user._id.toString()) {
        return res.status(400).send("you are not allowed to access this review");
    }

    const result = schema.validate({ id }, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};
const deleteReviewValidator =async(req, res, next) => {
    const id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().custom(isId, 'custom validation').required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    const review=await Review.findById(id)
    if(!review) {
        return res.status(400).send("there is no review with this id");
    }
    if(req.user.role=='user'){
    if(review.user._id.toString()!==req.user._id.toString()) {
        return res.status(400).send("you are not allowed to access this review");
    }
}
    const result = schema.validate({ id }, options);
    if (result.error) {
        return res.status(400).json(result.error.details);
    } else {
        next();
    }
};
module.exports ={
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
}