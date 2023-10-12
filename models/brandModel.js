const  mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Brand required"],
        unique:[true,"Brand must be unique"],
        minlength:[3,"Too Short Brand Name"],
        maxlength:[32,"Too Long Brand Name"],
    },
    slug:{
        type:String,
        lowercase:true,  //replace slashes with dashes
    },
    image:{
        type:String,
    }

},{timestamps:true}//timestamps make two fields created at , updated at
);
//on find one/all , update
BrandSchema.post('init',(doc)=>{
    if(doc.image){
        const imageURL=`${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image=imageURL;
    }
})
//on create
BrandSchema.post('save',(doc)=>{
    if(doc.image){
        const imageURL=`${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image=imageURL;
    }
})
module.exports = mongoose.model("Brand", BrandSchema);
