const multer = require("multer");
const ApiError = require("../utilities/ApiError");


const uploadSingleImage=(fieldName)=>{
    //disk Storage engine
    const multerStorageDisk=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/categories")
    },
    filename:function(req,file,cb){
        const extenstion=file.mimetype.split("/")[1]
        const filename=`category=${uuidv4()}-${Date.now()}.${extenstion}`;
        cb(null, filename);
    }})
    //memory storage engine
    const multerStorage=multer.memoryStorage()
    //allow image only
    const multerFilter=function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null, true)
        }else{
            cb(new ApiError('only images allowed',404), false)
        }
    }
    const upload=multer({storage:multerStorage,fileFilter:multerFilter})
    return upload.single(fieldName)
}
const uploadMixOfImages=(arrayOfFields)=>{
    const multerStorage=multer.memoryStorage()
    //allow image only
    const multerFilter=function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null, true)
        }else{
            cb(new ApiError('only images allowed',404), false)
        }
    }
    const upload=multer({storage:multerStorage,fileFilter:multerFilter})
    return upload.fields(arrayOfFields)
}

module.exports={
    uploadSingleImage,
    uploadMixOfImages
}