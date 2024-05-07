const express = require('express');
const router = express.Router();
const { addSpecials, updateSpecials, deleteSpecials } = require('../controllers/Specials');

router.post('/addSpecials', (req, res) => {
    // Callback function for handling POST /addSpecials route
    addSpecials(req, res); // Assuming addSpecials is defined in controllers/Specials.js
});

router.put('/updateSpecials', (req, res) => {
    // Callback function for handling PUT /updateSpecials route
    updateSpecials(req, res); // Assuming updateSpecials is defined in controllers/Specials.js
});

router.delete('/deleteSpecials', (req, res) => {
    // Callback function for handling DELETE /deleteSpecials route
    deleteSpecials(req, res); // Assuming deleteSpecials is defined in controllers/Specials.js
});

module.exports = router;
