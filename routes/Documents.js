const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const {uploadDocuments, updateDocuments} = require('../controllers/Documents')
router.post('/documents', auth, isuser, uploadDocuments)
router.put('/documents', auth, isuser, updateDocuments)
module.exports = router;