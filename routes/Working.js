const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

// # const{addWorking , updateWorking, deleteWorking} = require('');
const {addWorking, updateWorking, deleteWorking} =require('../controllers/Working')
router.post('/addWorking', auth , addWorking);
router.put('/updateWorking', auth , updateWorking);
router.delete('/deleteWorking' , auth , deleteWorking);
module.exports = router;