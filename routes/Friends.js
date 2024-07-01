const express = require('express');
const router = express.Router();
const { auth, isuser } = require('../middlewares/auth');
const { createFriends, updateFriends,getUserFriends } = require('../controllers/Friends');

router.post('/addFriends', auth, isuser, createFriends);
router.put('/updateFriends', auth, isuser, updateFriends);
router.get('/getUserFriends', auth, isuser, getUserFriends)

module.exports = router;
