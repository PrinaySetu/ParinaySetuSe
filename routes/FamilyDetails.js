const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const { addFamilyDetails, updateFamilyDetails,updatebrother,updatesister,removeSibling } = require('../controllers/FamilyDetails')

router.post('/addFamilyDetails', auth, isuser, addFamilyDetails)
router.put('/updatefamilyDetails', auth, isuser, updateFamilyDetails)
// router.put('/updateFamilyDetails/:id', auth, isuser, updateFamilyDetails)

router.put('/updatebrother', auth, isuser, updatebrother);
router.put('/updatesister', auth, isuser, updatesister);
router.put('/removeSibling', auth, isuser, removeSibling);
module.exports= router;