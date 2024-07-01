const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const { addFatherFamily, updateFatherFamily,getUserFatherFamily } = require('../controllers/FatherFamily')
// 导入controller
router.post('/addFatherFamily', auth, isuser, addFatherFamily);
router.put('/updateFatherFamily', auth, isuser, updateFatherFamily);
router.get('/getUserFatherFamily', auth, isuser, getUserFatherFamily);
module.exports=router;