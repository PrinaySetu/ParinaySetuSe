const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')
const {addMotherFamily, updateMotherFamily, getUserMotherFamily} = require('../controllers/MotherFamily')
router.post('/addMotherFamily', auth, isuser, addMotherFamily);
router.put('/updateMotherFamily', auth, isuser, updateMotherFamily);
router.get('/getUserMotherFamily', auth, isuser, getUserMotherFamily);
module.exports=router;