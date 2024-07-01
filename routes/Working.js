const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

// # const{addWorking , updateWorking, deleteWorking} = require('');
const {addWorking, updateWorking,getUserWorking} =require('../controllers/Working')
router.post('/addWorking', auth ,isuser, addWorking);
router.put('/updateWorking', auth ,isuser, updateWorking);
router.get('/getUserWorking', auth, isuser, getUserWorking);
module.exports = router;