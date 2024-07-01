const express= require('express');
const router = express.Router();
const {getAllUsers,getMainUser} = require('../controllers/Dashboard');
const {auth, isAdmin} = require('../middlewares/auth')
router.get('/getAllUsers', auth,isAdmin, getAllUsers);
router.get('/getMainUser/:id',auth,isAdmin,getMainUser);

module.exports = router;