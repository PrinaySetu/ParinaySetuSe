const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')
const {addRelative, updateRelative,getUserRelative} = require('../controllers/Relative')
router.post('/addRelative', auth, isuser, addRelative);
router.put('/updateRelative', auth, isuser, updateRelative);
router.get('/getUserRelative', auth, isuser, getUserRelative)
module.exports = router;