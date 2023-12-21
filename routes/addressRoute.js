const express = require('express');
const authController=require('../controllers/authController');
const { addAddress, removeAddress, getLoggedUserAddresses, getAddress, updateAddress } = require('../controllers/addressController');
const router = express.Router();


router.use(authController.protect,authController.allowedTo('user'))

router.route('/')
.post(addAddress)
.get(getLoggedUserAddresses)

router.route('/:addressId')
.get(getAddress)
.delete( removeAddress)
.put(updateAddress);



module.exports = router;