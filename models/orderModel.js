const mongoose =require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const orderSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'order must be belongs to user'],
    },
    cartItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
            },
            quantity:{
                type:Number,
            },
            color:{
                type:String,
            },
            price:{
                type:Number,
            },
    }
    ],
    taxPrice:{
        type:Number,
        default:0,
    },
    shippingAddress:{
        details:String,
        phone:String,
        city:String,
        postalCode:String,
    },
    shippingPrice:{
        type:Number,
        default:0,
    },
    totalOrderPrice:{
        type:Number,
    },
    paymentMethodType:{
        type:String,
        enum:['card','cash'],
        default:'cash'
    },
    isPaid:{
        type:Boolean,
        default:false,
    },
    paidAt:{
        type:Date,
    },
    isDelivered:{
        type:Boolean,
        default:false,
    },
    deliveredAt:{
        type:Date,
    }
},{
    timestamps:true
})
orderSchema.pre(/^find/,function(next){
    this.populate({path:'user',select:'name profileImg email phone'}).populate({path:'cartItems.product',select:'title imageCover'})
    next();
})
orderSchema.plugin(AutoIncrement, { inc_field: 'id' });
module.exports = mongoose.model('Order', orderSchema)