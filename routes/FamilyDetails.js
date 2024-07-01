const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const { addFamilyDetails, updateFamilyDetails,getUserFamilyDetails } = require('../controllers/FamilyDetails')

router.post('/addFamilyDetails', auth, isuser, addFamilyDetails)
router.put('/updatefamilyDetails', auth, isuser, updateFamilyDetails)
router.get('/getUserFamilyDetails', auth, isuser, getUserFamilyDetails)
module.exports= router;