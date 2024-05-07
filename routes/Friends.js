const express = require('express');
const router = express.Router();
const { auth, isuser } = require('../middlewares/auth');
const { createFriends, updateFriends, deleteFriends } = require('../controllers/Friends');

router.post('/addfriend', auth, isuser, createFriends);
router.put('/updatefriend', auth, isuser, updateFriends);
router.delete('/deletefriend', auth, isuser, deleteFriends);

module.exports = router;
