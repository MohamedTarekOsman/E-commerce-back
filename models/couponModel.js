const mongoose = require('mongoose');

const couponSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'coupon name is required'],
        unique:true
    },
    expire:{
        type:Date,
        required:[true,'coupon expire time is required'],
    },
    discount:{
        type:Number,
        required:[true,'coupon discount value is required'],
    }
},{
    timestamps:true
})

module.exports =mongoose.model('Coupon',couponSchema);