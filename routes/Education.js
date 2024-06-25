const express = require('express');
const router = express.Router();
const { auth, isuser } = require('../middlewares/auth');
const { addEducation, updateEducation,getUserEducation } = require('../controllers/Education'); // Import controller functions

// Define route for adding education (POST method)
router.post('/createEducation', auth, isuser, addEducation);

// Define route for updating education (PUT method)
router.put('/updateEducation', auth, isuser, updateEducation);

router.get('/getUserEducation', auth, isuser, getUserEducation);
module.exports = router;
