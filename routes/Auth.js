const express = require('express')
const router = express.Router()
const {auth} = require('../middlewares/auth')
const { signup , login, sendotp,changePassword } = require('../controllers/Auth')
const {resetPassword,resetPasswordToken} = require('../controllers/ResetPassword')
router.post('/signup',signup)
router.post('/login',login)
router.post('/sendotp',sendotp)
router.post('/changePassword',auth,changePassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)
module.exports=router; 