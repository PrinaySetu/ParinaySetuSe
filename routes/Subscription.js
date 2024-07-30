const express = require('express');
const router = express.Router();
const { getPlans, createSubscription, handleCallback, getSubscriptionStatus } = require('../controllers/Subscription');
const {auth, isuser} = require('../middlewares/auth')

// Route to get all subscription plans
router.get('/plans', getPlans);

// // Route to create a new subscription (requires authentication)
router.post('/create',auth, createSubscription);

// Route to handle Razorpay payment callback
router.post('/callback', auth ,handleCallback);

// Route to get current user's subscription (requires authentication)
router.put('/current',auth,  getSubscriptionStatus);

module.exports = router;
