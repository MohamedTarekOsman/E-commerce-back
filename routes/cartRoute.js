const express = require('express');
const { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, updateCartItemQuantity, applyCoupon } = require('../controllers/cartController');
const authController=require('../controllers/authController')
const router = express.Router();

router.use(authController.protect,authController.allowedTo('user'))

router.route('/')
.post(addProductToCart)
.get(getLoggedUserCart)
.delete(clearCart)


router.route('/applyCoupon').put(applyCoupon)


router.route('/:itemId')
.put(updateCartItemQuantity)
.delete(removeSpecificCartItem)




module.exports = router;