const  mongoose = require("mongoose");

const subCategorySchema=new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        unique:[true,"SubCategory must be unique"],
        minlength:[2,"too short SubCategory Name"],
        maxlength:[32,"too Long SubCategory Name"],
    },
    slug:{
        type:String,
        lowercase:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"SubCategory must be belongs to parent Category"],
    }
},{timestamps:true})

module.exports=mongoose.model("SubCategory",subCategorySchema)