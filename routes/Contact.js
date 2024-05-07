const express = require('express')
const router = express.Router()
const {auth, isuser} = require('../middlewares/auth')

const { createContacts, updateContacts } = require('../controllers/Contacts')

router.post('/createContacts', auth, isuser, createContacts)
router.put('/updateContacts', auth, isuser, updateContacts)

module.exports = router;