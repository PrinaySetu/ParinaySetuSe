const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const { addFatherFamily, updateFatherFamily,updateTau, updateBua } = require('../controllers/FatherFamily')
// 导入controller
router.post('/addFatherFamily', auth, isuser, addFatherFamily);
router.put('/updateFatherFamily', auth, isuser, updateFatherFamily);
router.put('/updateTau', auth, isuser, updateTau);
router.put('/updateBua', auth, isuser, updateBua);
module.exports=router;