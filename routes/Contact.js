const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const { createContacts, updateContacts, getUserContacts } = require('../controllers/Contacts')

router.post('/createContacts', auth, isuser, createContacts)
router.put('/updateContacts', auth, isuser, updateContacts)
router.get('/getUserContacts', auth, isuser, getUserContacts)

module.exports = router;