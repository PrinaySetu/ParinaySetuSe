const express = require('express');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('additionalDetails').exec();
        console.log("Users fetched:", users);
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
exports.getMainUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).populate('additionalDetails').exec();
        console.log(user);
        return res.status(200).json({ user });
    } catch (error) {
        console.log("Cannot get main user")
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// In your controller
exports.getAllOtherUsers = async (req, res) => {
    try {
        const { userId } = req.body;
        const users = await User.find({ _id: { $ne: userId } }).populate('additionalDetails').exec();
        console.log('Found users:', users.length);
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.log("Cannot get other users", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}