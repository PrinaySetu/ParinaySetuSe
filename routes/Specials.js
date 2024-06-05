const express = require('express');
const router = express.Router();
const {auth,isuser} = require('../middlewares/auth')
const { addSpecial, updateSpecials, deleteSpecials } = require('../controllers/Specials');

router.post('/addSpecials', auth, isuser,addSpecial);

router.put('/updateSpecial', auth, isuser, updateSpecials);

// router.delete('/deleteSpecials', auth, isuser, deleteSpecials);

module.exports = router;
