const crypto=require('crypto');

const jwt=require('jsonwebtoken');
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const bcrypt=require('bcryptjs');
const ApiError = require("../utilities/ApiError");
const sendEmail=require('../utilities/sendEmail');

//@desc     Signup
//@route    POST /api/v1/auth/signup
//@access   Public
const signUp=asyncHandler(async(req,res,next)=>{
    //create a new user
    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    })

    //generate Token
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE_TIME,
    });


    res.status(201).json({data:user,token});
})


//@desc     Login
//@route    POST /api/v1/auth/login
//@access   Public
const logIn=asyncHandler(async(req,res,next)=>{
    //check if user already exists in database
    const user=await User.findOne({email:req.body.email})
    if(!user||!(await bcrypt.compare(req.body.password,user.password))){
        return next(new ApiError('incorrect email or password',401))
    }

     //generate Token
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE_TIME,
    });

    res.status(201).json({data:user,token});
})

//@desc     make sure user is loged in
const protect=asyncHandler(async(req,res,next)=>{
    //(1)check if token already exists
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new ApiError('you are not login to get access to this route',401))
    }

    //(2)verify token (no change happen | expiration date)
    const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)

    //(3)check if user exists
    const currentUser=await User.findById(decoded.userId);
    if(!currentUser){
        return next(new ApiError("the user that belongs to this token doesn't exist",401))
    }

    //(4)check if user change his password after token created
    if(currentUser.passwordChangedAt){
        const passChangedTimestamp=parseInt(currentUser.passwordChangedAt.getTime()/1000,10);  
    
        //password changed after token created
        if(passChangedTimestamp>decoded.iat){
            return next(new ApiError("the user changed his password , please login again..",401))
        }
    }

    req.user = currentUser;
    next();
})

//@desc     make sure user is authorized to access routes
const allowedTo=(...roles)=>asyncHandler(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ApiError('you are not allowed to access this route',403))
    }
    next();
})



//@desc     forget password
//@route    POST /api/v1/auth/forgotPassword
//@access   Public
const forgetPassword=asyncHandler(async(req,res,next)=>{
    // 1) get user by email 
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ApiError('there is no user with this email',404))
    }

    // 2) if user exists, generate hash reset random 6 digits and save it in db
    const resetCode=Math.floor(100000+Math.random()*900000).toString();
    const hashedResetCode=crypto.createHash('sha256').update(resetCode).digest('hex');

    // 3) save password reset code in db and make validation for 10 minutes
    user.passwordResetCode=hashedResetCode
    user.passwordResetExpires=Date.now()+(10*60*1000)
    user.passwordResetVerified = false;

    await user.save();

    // 4)send reset code via email
    const message = `Hi ${user.name},\n We received a request to reset the password on your E-commerce Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
    await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
  
      await user.save();
      return next(new ApiError(err, 500));
    }

    res
      .status(200)
      .json({ status: 'Success', message: 'Reset code sent to email' });
})

//@desc     verify password reset code
//@route    POST /api/v1/auth/verifyResetCode
//@access   Public
const veriyPassResetCode=asyncHandler(async(req,res,next)=>{
    // 1)get user based on reset code and expiration date
    const hashedResetCode=crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user=await User.findOne({
    passwordResetCode:hashedResetCode,
    passwordResetExpires:{$gt :Date.now()}
    })
    if(!user){
        return next(new ApiError('Reset code invalied or expired', 500));
    }
    // 2)reset code valid
    user.passwordResetVerified=true;
    await user.save();
    res.status(200).json({
        status: 'success',
    })
})

//@desc     reset password
//@route    POST /api/v1/auth/resetPassword
//@access   Public
const resetPassword=asyncHandler(async(req,res,next)=>{
    // 1)get user based on email
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ApiError(`there is no user with this email ${req.body.email}`,404));
    }

    // 2)check if reset code is verified
    if(!user.passwordResetVerified){
        return next(new ApiError(`reset code not verified  ${req.body.email}`,400));
    }

    user.password=req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    //if everything is ok,generate token
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE_TIME,
    });
    res.status(200).json({token});
})
module.exports = {
    signUp,
    logIn,
    protect,
    allowedTo,
    forgetPassword,
    veriyPassResetCode,
    resetPassword
}