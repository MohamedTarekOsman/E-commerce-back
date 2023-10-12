const asyncHandler = require('express-async-handler');
const ApiError = require('../utilities/ApiError');
const User = require("../models/userModel");



//@desc     add product to wishlist
//@route    POST /api/v1/wishlist
//@access   Protected/User
const addProductToWishList=asyncHandler(async(req,res,next)=>{
    // $addToSet => add product id to wishlist array if prductId is not exist in wishlist array
    const user =await User.findByIdAndUpdate(req.user._id,{
        $addToSet:{wishlist:req.body.productId}
    },{
        new:true,
        runValidators:true
    })
    res.status(200).json({statuse:"success",message:"Product add successfully to your wishlist",data:user.wishlist})
})

//@desc     remove product from wishlist
//@route    Delete /api/v1/wishlist/:productId
//@access   Protected/User
const removeProductFromWishList=asyncHandler(async(req,res,next)=>{
    // $pull => remove productId from wishlist array if prductId is exists in wishlist array
    const user =await User.findByIdAndUpdate(req.user._id,{
        $pull:{wishlist:req.params.productId}
    },{
        new:true,
        runValidators:true
    })
    res.status(200).json({statuse:"success",message:"Product removed successfully from your wishlist",data:user.wishlist})
})


//@desc     get logged user wishlist
//@route    GET /api/v1/wishlist/
//@access   Protected/User
const getLoggedUserWishlist=asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user._id).populate('wishlist')
    res.status(200).json({statuse:"success",results:user.wishlist.length,data:user.wishlist})
})
module.exports = {
    addProductToWishList,
    removeProductFromWishList,
    getLoggedUserWishlist
}