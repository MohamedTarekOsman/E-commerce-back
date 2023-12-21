const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");



//@desc     add address to user addresses list
//@route    POST /api/v1/addresses
//@access   Protected/User
const addAddress=asyncHandler(async(req,res,next)=>{
    // $addToSet => add address to user addresses array
    const user =await User.findByIdAndUpdate(req.user._id,{
        $addToSet:{addresses:req.body}
    },{
        new:true,
        runValidators:true
    })
    res.status(200).json({statuse:"success",message:"Address added successfully",data:user.addresses})
})

//@desc     remove address from user addresses list
//@route    Delete /api/v1/addresses/:addressId
//@access   Protected/User
const removeAddress=asyncHandler(async(req,res,next)=>{
    // $pull => remove address from  addresses list array
    const user =await User.findByIdAndUpdate(req.user._id,{
        $pull:{addresses:{_id:req.params.addressId}}
    },{
        new:true,
        runValidators:true
    })
    res.status(200).json({statuse:"success",message:"address removed successfully",data:user.addresses})
})


//@desc     get logged user addresses list
//@route    GET /api/v1/addresses
//@access   Protected/User
const getLoggedUserAddresses=asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user._id).populate('addresses')
    res.status(200).json({statuse:"success",results:user.addresses.length,data:user.addresses})
})

// @desc      update address from addresses list
// @route     PUT /api/v1/addresses/:addressId
// @access    Private/User
const updateAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
  
    const address = user.addresses.id(req.params.addressId);
  
    address.alias = req.body.alias || address.alias;
    address.details = req.body.details || address.details;
    address.phone = req.body.phone || address.phone;
    address.city = req.body.city || address.city;
    address.postalCode = req.body.postalCode || address.postalCode;
  
    await user.save();
  
    return res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: address,
    });
  });
  
  // @desc      Get Specific address from addresses list
  // @route     Get /api/v1/addresses/:addressId
  // @access    Private/User
const getAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
  
    const address = user.addresses.id(req.params.addressId);
  
    return res.status(200).json({
      status: 'success',
      data: address,
    });
  });
module.exports = {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
    getAddress,
    updateAddress
}