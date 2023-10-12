const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    cartItems:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
            },
            quantity:{
                type:Number,
                default:1
            },
            color:{
                type:String,
            },
            price:{
                type:Number,
            },
    }],
    
    totalCartPrice:{
        type:Number,
    },
    totalPriceAfterDiscount:{
        type:Number,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true})


module.exports = mongoose.model('Cart',cartSchema);