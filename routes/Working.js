const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

// # const{addWorking , updateWorking, deleteWorking} = require('');
const {addWorking, updateWorking, deleteWorking} =require('../controllers/Working')
router.post('/addworking', auth , addWorking);
router.put('/updateworking', auth , updateWorking);
router.delete('/deleteworking' , auth , deleteWorking);
module.exports = router;