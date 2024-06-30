const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

// # const{addWorking , updateWorking, deleteWorking} = require('');
const {addWorking, updateWorking, deleteWorking,getUserWorking} =require('../controllers/Working')
router.post('/addWorking', auth ,isuser, addWorking);
router.put('/updateWorking', auth ,isuser, updateWorking);
router.delete('/deleteWorking' , auth , deleteWorking);
router.get('/getUserWorking', auth, isuser, getUserWorking);
module.exports = router;