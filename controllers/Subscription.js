const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const subscriptionPlans = require('../config/subscriptionPlan');
const mailSender = require('../utils/mailSender'); // Import your mailSender function
const { time } = require('console');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

exports.getPlans = (req, res) => {
    try{
            return res.json(subscriptionPlans);
    }
    catch (error) {
        console.error('Error in getPlans:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.createSubscription = async (req, res) => {
    console.log("createSubscription function called");
    try {
        const { planId } = req.body;
        const userId = req.user.id;

        if (!planId) {
            return res.status(400).json({ error: 'Plan ID is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const existingSubscription = await Subscription.findOne({ user: userId });
        if (existingSubscription) {
            console.log("User already has a subscription");
            return res.status(400).json({ error: 'User already has a subscription' });
        }

        const plan = subscriptionPlans.find(p => p.id === planId);
        if (!plan) {
            console.error('Plan not found for planId:', planId);
            return res.status(404).json({ error: 'Plan not found' });
        }

        const options = {
            amount: plan.price * 100,
            currency: 'INR',
            receipt: `rcpt_${userId.slice(-4)}_${planId}`.slice(0, 40)
        };

        const order = await razorpay.orders.create(options);

        if (!order || !order.id) {
            console.error("Invalid order object returned by Razorpay");
            return res.status(500).json({ error: 'Invalid order object returned by Razorpay' });
        }

        const subscription = await Subscription.create({
            user: userId,
            planId: plan.id,
            planName: plan.name,
            status: 'pending',
            amount: plan.price,
            transactionId: order.id
        });

        return res.status(200).json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount
        });
    } catch (error) {
        console.error('Unexpected error in createSubscription:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
        console.log("createSubscription function completed");
    }
};



exports.handleCallback = async (req, res) => {
    try {
        const razorpay_order_id = req.body?.razorpay_order_id
        const razorpay_payment_id = req.body?.razorpay_payment_id
        const razorpay_signature = req.body?.razorpay_signature

        let body = razorpay_order_id + "|" + razorpay_payment_id

        const generatedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_SECRET)
          .update(body.toString())
          .digest("hex")
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const subscription = await Subscription.findOne({ transactionId: razorpay_order_id });
        // const transaction = await Transaction.findOne({ transactionId: razorpay_order_id });

        // if (!subscription || !transaction) {
        //     return res.status(404).json({ error: 'Subscription or transaction not found' });
        // }

        subscription.status = 'active';
        subscription.startDate = new Date();
        subscription.endDate = subscription.planId === 'lifetime' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await subscription.save();

        // transaction.status = 'success';
        // transaction.paymentDetails = {
        //     razorpay_payment_id,
        //     razorpay_order_id,
        //     razorpay_signature
        // };
        // await transaction.save();
        

        await User.findByIdAndUpdate(subscription.user, { currentSubscription: subscription._id });

        // Send a successful payment email
        const user = await User.findById(subscription.user);
        const mailOptions = {
            subject: 'Payment Successful',
            text: `Dear ${user.name},\n\nYour payment for the ${subscription.planName} plan was successful. Your subscription is now active.\n\nThank you for choosing our service.\n\nBest regards,\nYour Company Name`
        };

        mailSender(user.email, mailOptions.subject, mailOptions.text);

        res.json({ message: 'Payment successful, subscription activated' });
    } catch (error) {
        console.error('Error in handleCallback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSubscriptionStatus = async (req, res) => {
    console.log("getSubscriptionStatus function called");
    try {
        console.log('User ID:', req.user.id);
        const user = req.user.id;
        console.log('Searching for subscription');
        const subscription = await Subscription.findOne({ user: user });
        console.log('Subscription found:', subscription);
        
        if (!subscription) {
            return res.status(404).json({
                status: 'pending',

                error: 'Subscription not found lalallal' });
        }

        // Check if the subscription should be expired
        if (subscription.status === 'active' && subscription.endDate && new Date() > subscription.endDate) {
            subscription.status = 'expired';
            await subscription.save();
        }

        // Return the subscription status
        if (subscription.status === 'active') {
            return res.json({
                status: 'active',
                endtime: subscription.endDate,
                plan: subscription.planName
            });
        } else if (subscription.status === 'expired') {
            return res.json({
                status: 'expired'
            });
        } else {
            return res.json({
                status: 'pending'
            });
        }
    } catch (error) {
        console.error('Error in getSubscriptionStatus:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
