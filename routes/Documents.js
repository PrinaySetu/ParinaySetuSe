const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const {uploadDocuments, updateDocuments} = require('../controllers/Documents')
router.post('/uploadDocuments', auth, isuser, uploadDocuments)
router.put('/updateDocuments', auth, isuser, updateDocuments)
module.exports = router;