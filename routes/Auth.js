const express = require('express')
const router = express.Router()
const {auth} = require('../middlewares/auth')
const { signup , login, sendotp,changePassword } = require('../controllers/Auth')
router.post('/signup',signup)
router.post('/login',login)
router.post('/sendotp',sendotp)
router.post('/changePassword',auth,changePassword)
module.exports=router; 