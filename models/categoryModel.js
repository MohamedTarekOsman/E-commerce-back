const  mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"category required"],
        unique:[true,"category must be unique"],
        minlength:[3,"Too Short Category Name"],
        maxlength:[32,"Too Long Category Name"]
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
categorySchema.post('init',(doc)=>{
    if(doc.image){
        const imageURL=`${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image=imageURL;
    }
})
//on create
categorySchema.post('save',(doc)=>{
    if(doc.image){
        const imageURL=`${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image=imageURL;
    }
})
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports=CategoryModel;