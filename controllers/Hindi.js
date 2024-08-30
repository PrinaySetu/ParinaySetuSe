const express = require('express');
const Hindi = require('../models/Hindi');

exports.addLink = async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ msg: "Link is required" });
        }
        const hindi = await Hindi.create({ link });
        return res.status(200).json({
            success: true,
            hindi,
            message: "Link added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Link cannot be added. Please try again.",
        });
    }
};

exports.getLink = async (req, res) => {
    try {
        const latestLink = await Hindi.findOne().sort({ createdAt: -1 });
        console.log("Latestttt linkkkk",latestLink);
        if (!latestLink) {
            return res.status(404).json({
                success: false,
                message: "No link found",
            });
        }
        return res.status(200).json({
            success: true,
            link: latestLink.link,
            createdAt: latestLink.createdAt,
            message: "Latest link fetched successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Link cannot be fetched. Please try again.",
        });
    }
};

exports.updateLink = async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ msg: "Link is required" });
        }

        const newLink = await Hindi.create({ link });

        return res.status(200).json({
            success: true,
            link: newLink.link,
            createdAt: newLink.createdAt,
            message: "New link added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Link cannot be updated. Please try again.",
        });
    }
};