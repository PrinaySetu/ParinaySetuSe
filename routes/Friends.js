const express = require('express');
const router = express.Router();
const { auth, isuser } = require('../middlewares/auth');
const { createFriends, updateFriends, deleteFriends,getUserFriends } = require('../controllers/Friends');

router.post('/addFriends', auth, isuser, createFriends);
router.put('/updateFriends', auth, isuser, updateFriends);
router.delete('/deleteFriends', auth, isuser, deleteFriends);
router.get('/getUserFriends', auth, isuser, getUserFriends)

module.exports = router;
