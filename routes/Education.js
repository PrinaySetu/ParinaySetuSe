const express = require('express');
const router = express.Router();
const { auth, isuser } = require('../middlewares/auth');
const { addEducation, updateEducation } = require('../controllers/Education'); // Import controller functions

// Define route for adding education (POST method)
router.post('/createEducation', auth, isuser, addEducation);

// Define route for updating education (PUT method)
router.put('/updateEducation', auth, isuser, updateEducation);

module.exports = router;
