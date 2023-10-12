const ApiError = require("../utilities/ApiError");
const asyncHandler=require('express-async-handler');
const ApiFeatures = require('../utilities/apiFeatures');



const updateOne=(Model)=>asyncHandler(async(req, res,next)=>{
    const document=await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!document){
        return next(new ApiError(`document not found for this id : ${req.params.id}`,404));
    }
    //trigger save event when update document
    document.save();
    res.status(200).json({data: document})
})

const deleteOne = (Model) =>asyncHandler(async(req, res,next)=>{
    const {id}=req.params
    const document=await Model.findByIdAndDelete(id)
    if(!document){
        return next(new ApiError(`document not found for this id : ${id}`,404));
    }
    //trigger remove event when deleting document
    document.remove();
    res.status(200).json("document deleted successfully")
})

const createOne = (Model) =>asyncHandler(async(req, res)=>{
    const newDoc=await Model.create(req.body)
    res.status(200).json({data: newDoc})
})

const getOne = (Model,populationOpt) =>asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    // build query
    let query= Model.findById(id);
    if(populationOpt){
        query=query.populate(populationOpt)
    }

    // execute query
    const document=await query;
    if(!document){
        return next(new ApiError(`Document not found for this id : ${id}`,404));
    }
    res.status(200).json({data: document})
})

const getAll=(Model,modelName='')=>asyncHandler(async(req,res)=>{
    let filter={};
    if(req.filterObj){
        {filter=req.filterObj}
    }
    //build query
    const documentsCount=await Model.countDocuments();
    const apiFeatures=new ApiFeatures(Model.find(filter), req.query).paginate(documentsCount).filter().search(modelName).sort();
    
    //excute query
    const {mongooseQuery,paginationResult}=apiFeatures
    const document=await mongooseQuery
    res.status(200).json({results:document.length,paginationResult,data: document})
})
module.exports ={
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
}