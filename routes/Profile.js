const express = require('express')
const router = express.Router()
const {auth, isuser,isAdmin} = require('../middlewares/auth')
const {createProfile, updateProfile,
    deleteProfile,getProfileById, addRecommendedProfile,removeRecommendedProfile
} = require('../controllers/Profile')

router.post('/createProfile', auth, isuser, createProfile)
router.put('/updateProfile', auth, isuser, updateProfile)
router.delete('/deleteProfile', auth, isAdmin, deleteProfile)
router.get('/getProfileById/:id', auth, getProfileById)
router.put('/addRecommendedProfile/:id', auth, isAdmin, addRecommendedProfile)
router.delete('/removeRecommendation/:id', auth, isAdmin, removeRecommendedProfile)
module.exports = router

