const ApiError = require("../utilities/ApiError")

const handlejwtInvalidSignature=()=>{
    return new ApiError('Invalid Token ,Please login again..',401)
}
const globalError=(err,req,res,next) => {
    err.statusCode = err.statusCode || 500
    err.status=err.status||'error'
    if(process.env.NODE_ENV==='development'){
        sendErrorForDev(err,res)
    }else{
        if(err.name==='jsonWebTokenError'){
            err=handlejwtInvalidSignature();
        }
        sendErrorForProd(err,res)
    }
}
const sendErrorForDev=(err,res) => {
    return res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack,
    })
}
const sendErrorForProd=(err,res) => {
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })
}
module.exports={
    globalError
}