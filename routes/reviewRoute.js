const express = require('express');
const { getReviews, createReview, getReview, updateReview, deleteReview, createFilterObj, setProductIdAndUserIdToBody } = require('../controllers/reviewController');
const { getReviewValidator, createReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../utilities/validators/reviewValidator');
const authController=require('../controllers/authController')

const router = express.Router({mergeParams:true});



router.route('/')
.get(createFilterObj,getReviews)
.post(authController.protect,
    authController.allowedTo('user'),setProductIdAndUserIdToBody,createReviewValidator ,createReview)


router.route('/:id')
.get(getReviewValidator,getReview)
.put(authController.protect,
    authController.allowedTo('user'),updateReviewValidator,updateReview)
.delete(authController.protect,
    authController.allowedTo('admin','manager','user'),deleteReviewValidator,deleteReview)




module.exports = router;