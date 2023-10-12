const slugify=require('slugify');
const User = require("../models/userModel")
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middleWares/uploadImageMiddleware');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utilities/ApiError');
const bcrypt = require('bcryptjs');
const createToken=require('../utilities/createToken');
//upload a single image
const uploadUserImage=uploadSingleImage('profileImg');

//image processing
const resizeImage=asyncHandler(async function (req,res,next){
    if(req.file){
        const filename=`user=${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer).resize(600,600).toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/users/${filename}`)
        //save image to db
        req.body.profileImg=filename;
    }
    next();
})


const applyUserSlugify=(req,res,next) => {
    if(req.body.name){
        req.body.slug=slugify(req.body.name);
    }
    next();
}

//@desc     Get List Of users
//@route    GET /api/v1/users
//@access   Private
const getUsers=factory.getAll(User,"users")

//@desc     Get Specific user by id
//@route    GET /api/v1/users/:id
//@access   Private
const getUser=factory.getOne(User)

//@desc     Create user
//@route    POST /api/v1/users
//@access   Private
const createUser= factory.createOne(User)

//@desc     Update Specific user
//@route    PUT /api/v1/users/:id
//@access   Private
const updateUser=asyncHandler(async(req, res,next)=>{
    const document=await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        slug:req.body.slug,
        phone:req.body.phone,
        email:req.body.email,
        profileImg:req.body.profileImg,
        role:req.body.role, 
    },{
        new:true,
        runValidators:true
    })
    if(!document){
        return next(new ApiError(`document not found for this id : ${req.params.id}`,404));
    }
    res.status(200).json({data: document})
})
//@desc     Update Specific user password
//@route    PUT /api/v1/users/changePassword/:id
//@access   Private
const changePassword=asyncHandler(async(req, res,next)=>{ 
    const document=await User.findByIdAndUpdate(req.params.id,{
        password:await bcrypt.hash(req.body.password,8),
        passwordChangedAt:Date.now()
    },{
        new:true,
        runValidators:true
    })
    if(!document){
        return next(new ApiError(`document not found for this id : ${req.params.id}`,404));
    }
    res.status(200).json({data: document})
})
//@desc     Delete Specific user
//@route    DELETE /api/v1/users/:id
//@access   Private
const deleteUser=factory.deleteOne(User) 

//@desc     Get Logged user Data
//@route    GET /api/v1/users/getMe
//@access   Private/Protect
const getLoggedUserData = asyncHandler(async(req, res,next)=>{
    req.params.id = req.user._id;
    next();
})


//@desc     updeate Logged user password
//@route    PUT /api/v1/users/chageMyPassword
//@access   Private/Protect
const updateLoggedUserPassword = asyncHandler(async(req, res,next)=>{
    //update user password based in user payload (req.user._id)
    const user=await User.findByIdAndUpdate(req.user._id,{
        password:await bcrypt.hash(req.body.password,8),
        passwordChangedAt:Date.now()
    },{
        new:true,
        runValidators:true
    })

    //generate token
    const token=createToken(user._id)
    res.status(200).json({data: user,token})
})

//@desc     updeate Logged user Data (without password,role)
//@route    PUT /api/v1/users/updateMe
//@access   Private/Protect
const updateLoggedUserData = asyncHandler(async(req, res,next)=>{
    const updateduser=await User.findByIdAndUpdate(req.user._id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    },{
        new: true,
        runValidators:true
    })
    res.status(200).json({data:updateduser})
})

//@desc     deactivate Logged user
//@route    Delete /api/v1/users/deleteMe
//@access   Private/Protect
const deleteLoggedUserData = asyncHandler(async(req, res,next)=>{
    await User.findByIdAndUpdate(req.user._id,{active:false});
    res.status(200).send("account deactivated successfully")
})
module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    applyUserSlugify,
    uploadUserImage,
    resizeImage,
    changePassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData
}