const express= require('express');
const router = express.Router();
const {getAllUsers,getMainUser, getAllOtherUsers} = require('../controllers/Dashboard');
const {auth, isAdmin} = require('../middlewares/auth')
router.get('/getAllUsers', auth,isAdmin, getAllUsers);
router.get('/getMainUser/:id',auth,isAdmin,getMainUser);
router.get('/users',auth,isAdmin, getAllOtherUsers);

module.exports = router;