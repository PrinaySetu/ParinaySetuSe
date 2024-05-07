const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')
const {addProperty, updateProperty} = require('../controllers/Property')
router.post('/addProperty', auth, isuser, addProperty);
router.put('/updateProperty', auth, isuser, updateProperty);
module.exports=router;

