const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')
const {addRelative, updateRelative,deleteRelative} = require('../controllers/Relative')
router.post('/addRelative', auth, isuser, addRelative);
router.put('/updateRelative', auth, isuser, updateRelative);
router.delete('/deleteRelative', auth, isuser, deleteRelative);
module.exports = router;