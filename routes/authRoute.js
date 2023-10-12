const express = require('express');
const { signUp, logIn, forgetPassword, veriyPassResetCode, resetPassword } = require('../controllers/authController');
const { signUpValidator, logInValidator } = require('../utilities/validators/authValidator');
const router = express.Router();


router.post('/signup', signUpValidator,signUp)
router.post('/login', logInValidator,logIn)
router.post('/forgotPassword', forgetPassword)
router.post('/verifyResetCode', veriyPassResetCode)
router.put('/resetPassword', resetPassword)

module.exports = router;