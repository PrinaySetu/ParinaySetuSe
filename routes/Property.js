const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')
const {addProperty, updateProperty,getUserProperty} = require('../controllers/Property')
router.post('/addProperty', auth, isuser, addProperty);
router.put('/updateProperty', auth, isuser, updateProperty);
router.get('/getUserProperty', auth, isuser, getUserProperty)
module.exports=router;

