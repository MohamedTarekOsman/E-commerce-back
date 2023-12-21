const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, applyUserSlugify, uploadUserImage, resizeImage, changePassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } = require('../controllers/userController');
const { getUserValidator, createUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator, changeUserPasswordValidatorForLogged, updateUserValidatorForLogged } = require('../utilities/validators/userValidator');
const authController=require('../controllers/authController')
const router = express.Router();

router.use(authController.protect)

router.get('/getMe',getLoggedUserData,getUser)
router.put('/chageMyPassword',changeUserPasswordValidatorForLogged,updateLoggedUserPassword)
router.put('/updateMe',updateUserValidatorForLogged,updateLoggedUserData)
router.put('/deleteMe',deleteLoggedUserData)


router.use(authController.allowedTo('admin','manager'));
router.put('/changePassword/:id',changeUserPasswordValidator,changePassword)
router.route('/')
.get(getUsers)
.post(uploadUserImage,resizeImage,createUserValidator,applyUserSlugify,createUser)


router.route('/:id')
.get(getUserValidator,getUser)
.put(uploadUserImage,resizeImage,applyUserSlugify,updateUser)
.delete(deleteUserValidator,deleteUser)




module.exports = router;