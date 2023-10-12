const express = require('express');
const authController=require('../controllers/authController');
const { addProductToWishList, removeProductFromWishList, getLoggedUserWishlist } = require('../controllers/wishlistController');
const router = express.Router();


router.use(authController.protect,authController.allowedTo('user'))

router.route('/')
.post(addProductToWishList)
.get(getLoggedUserWishlist)

router.route('/:productId')
.delete(removeProductFromWishList)



module.exports = router;