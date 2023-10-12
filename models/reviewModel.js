const mongoose = require('mongoose');
const Product =require('./productModel');
const reviewSchema =new mongoose.Schema({
    title:{
        type: String,
    },
    ratings:{
        type:Number,
        min:[1,'min rating is 1.0'],
        max:[5,'max rating is 5.0'],
        required:[true, "review ratings is required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "review must be belong to user"]
    },
    // parent reference (one to many) 
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true, "review must be belong to product"]
    }
},{
    timestamps: true
})
reviewSchema.pre(/^find/, function(next){
    this.populate({path:'user',select:'name'});
    next();
})
reviewSchema.statics.calcAverageRatingAndQuantity=async function(productId){
    const result=await this.aggregate([
        // 1) stage 1 :get all reviews in specifc product
        {$match:{product: productId}},

        // 2) stage 2 :grouping reviews based on product id and calculate averageRatings and averageQuantity
        {
            $group:{
                _id:'product',
                avgratings:{$avg:'$ratings'},
                ratingsQuantity:{$sum:1}
            }
        },
    ])
    if(result.length>0){
        await Product.findByIdAndUpdate(productId, {ratingsAverage:result[0].avgratings,ratingsQuantity:result[0].ratingsQuantity})
    }else{
        await Product.findByIdAndUpdate(productId, {ratingsAverage:0,ratingsQuantity:0})
    }
}

reviewSchema.post('save',async function(){
    await this.constructor.calcAverageRatingAndQuantity(this.product)
})
reviewSchema.post('remove',async function(){
    await this.constructor.calcAverageRatingAndQuantity(this.product)
})
module.exports=mongoose.model('Review',reviewSchema)