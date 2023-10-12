const Review = require("../models/reviewModel")
const factory = require('./handlersFactory');

//nested route
//GET /api/v1/products/:productId/reviews
const createFilterObj=(req,res,next)=>{
    let filterObj={};
    if(req.params.productId){
        filterObj={product:req.params.productId}
    }
    req.filterObj=filterObj;
    next();
}

//nested route
//POST /api/v1/products/:productId/reviews
const setProductIdAndUserIdToBody =(req,res,next)=>{
    if (!req.body.product){
        req.body.product =req.params.productId
    }
    if (!req.body.user){
        req.body.user =req.user._id
    }
    next()
}

//@desc     Get List Of reviews
//@route    GET /api/v1/reviews
//@access   Public
const getReviews=factory.getAll(Review,"Review");

//@desc     Get Specific review by id
//@route    GET /api/v1/reviews/:id
//@access   Public
const getReview=factory.getOne(Review)

//@desc     Create review
//@route    POST /api/v1/reviews
//@access   Private/Protect/User
const createReview= factory.createOne(Review)

//@desc     Update Specific review
//@route    PUT /api/v1/reviews/:id
//@access   Private/Protect/User
const updateReview=factory.updateOne(Review);


//@desc     Delete Specific review
//@route    DELETE /api/v1/reviews/:id
//@access   Private/Protect/User-Admin-Manager
const deleteReview=factory.deleteOne(Review) 


module.exports = {
    getReview,
    createReview,
    getReviews,
    updateReview,
    deleteReview,
    createFilterObj,
    setProductIdAndUserIdToBody
}