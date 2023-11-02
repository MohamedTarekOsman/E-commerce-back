const  mongoose  = require("mongoose");

const productSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim:[true,'title is required'],
        minlength:[3,"Too short product title"],
        maxlength:[100,"Too long product title"]
    },
    slug:{
        type: String,
        required: true,
        lowercase:true,
    },
    description:{
        type: String,
        required: [true,'description is required'],
        minlength:[2,"Too short product description"]
    },
    quantity:{
        type: Number,
        required: [true,'quantity is required']
    },
    sold:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        trim: true,
        required: [true,'price is required'],
        max:[2000000,"too long price"]
    },
    priceAfterDiscount:{
        type: Number,
    },
    colors:[String],
    imageCover:{
        type: String,
        required: [true,'imageCover is required']
    },
    images:[String],
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true,'category is required']
    },
    subCategory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    }],
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage:{
        type: Number,
        min: [1,'rating must be above 1'],
        max: [5,'rating must be below 5'],
    },
    ratingsQuantity:{
        type: Number,
        default:0
    }
},{
    timestamps:true,
    //to enable virtual populate
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})
productSchema.virtual("reviews",{
    ref:'Review',
    foreignField:"product",
    localField:'_id'
})

productSchema.pre(/^find/,function (next){
    this.populate({
        path:'category',
        select:'name',
    });
    next();
})
//on find one/all , update
productSchema.post('init',(doc)=>{
    if(doc.imageCover){
        const imageURL=`${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover=imageURL;
    }
    if(doc.images){
        const imageList=[]
        doc.images.forEach((image)=>{
            const imageURL=`${process.env.BASE_URL}/products/${image}`;
            imageList.push(imageURL);
        })
        doc.images=imageList;
    }
})
//on create
productSchema.post('save',(doc)=>{
    if(doc.imageCover){
        const imageURL=`${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover=imageURL;
    }
    if(doc.images){
        const imageList=[]
        doc.images.forEach((image)=>{
            const imageURL=`${process.env.BASE_URL}/products/${image}`;
            imageList.push(imageURL);
        })
        doc.images=imageList;
    }
})
module.exports=mongoose.model('Product',productSchema)