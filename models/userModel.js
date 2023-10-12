const mongoose  = require("mongoose");
const bcrypt =require("bcryptjs");
const userSchema =new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required: [true,'name required']
    },
    slug:{
        type: String,
        lowercase:true,
    },
    email:{
        type:String,
        required: [true,'email required'],
        unique:true,
        lowercase:true
    },
    phone: {
        type: String
    },
    profileImg:  {
        type: String
    },
    password:{
        type:String,
        required: [true,'password required'],
        minlength:[8,'TOO Short Password']
    },
    passwordChangedAt:{
        type:Date
    },
    passwordResetCode:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    },
    passwordResetVerified:{
        type:Boolean
    },
    role:{
        type: String,
        enum:['admin','manager', 'user'],
        default:'user',
    },
    active:{
        type:Boolean,
        default:true,
    },
    // child reference (one to many)
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }],
    addresses:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        alies:{type:String},
        details:{type:String},
        phone:{type:String},
        city:{type:String},
        posalCode:{type:String},
    }]
},{
    timestamps:true
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){ return next();}
    this.password = await bcrypt.hash(this.password,8)
    next()
})
const User=mongoose.model('User',userSchema);

module.exports =User;