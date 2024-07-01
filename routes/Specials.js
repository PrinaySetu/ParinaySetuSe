const express = require('express');
const router = express.Router();
const {auth,isuser} = require('../middlewares/auth')
const { addSpecial, updateSpecials,getUserSpecials } = require('../controllers/Specials');

router.post('/addSpecials', auth, isuser,addSpecial);

router.put('/updateSpecial', auth, isuser, updateSpecials);

router.get('/getUserSpecials', auth, isuser, getUserSpecials);
module.exports = router;
