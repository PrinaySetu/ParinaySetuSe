const Friends = require('../models/Friends');
const Profile = require('../models/Profile');
const { ObjectId } = require('mongoose').Types;

exports.createFriends = async (req, res) => {
    try {
        const {
           
            firstFriendName,
            firstFriendRelation,
            firstFriendContact,
            firstFriendAddress,
            secondFriendName,
            secondFriendRelation,
            secondFriendContact,
            secondFriendAddress
        } = req.body;
        const profileId = req.user.additionalDetails._id;
        if (!ObjectId.isValid(profileId)) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        let profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        let friendExist = profile.friends.some((friend) => friend.firstFriendName === firstFriendName);

        if (friendExist) {
            return res.status(400).json({ message: 'Friend already exists' });
        }

        const newFriend = await Friends.create({
            firstFriendName,
            firstFriendRelation,
            firstFriendContact,
            firstFriendAddress,
            secondFriendName,
            secondFriendRelation,
            secondFriendContact,
            secondFriendAddress
        });

        profile.friends.push(newFriend._id);
        await profile.save();

        res.status(200).json({
            message: 'Friend added and profile updated successfully',
            data: newFriend
        });
    } catch (error) {
        console.error('Error adding friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateFriends = async (req, res) => {
    try {
        const {
            friendsId,
            firstFriendName,
            firstFriendRelation,
            firstFriendContact,
            firstFriendAddress,
            secondFriendName,
            secondFriendRelation,
            secondFriendContact,
            secondFriendAddress
        } = req.body;

        if (!ObjectId.isValid(friendsId)) {
            return res.status(400).json({ message: 'Invalid Friends ID' });
        }

        const friends = await Friends.findById(friendsId);
        if (!friends) {
            return res.status(404).json({ message: 'Friends not found' });
        }

        // Update the fields with the provided values (if not null/undefined)
        friends.firstFriendName = firstFriendName || friends.firstFriendName;
        friends.firstFriendRelation = firstFriendRelation || friends.firstFriendRelation;
        friends.firstFriendContact = firstFriendContact || friends.firstFriendContact;
        friends.firstFriendAddress = firstFriendAddress || friends.firstFriendAddress;
        friends.secondFriendName = secondFriendName || friends.secondFriendName;
        friends.secondFriendRelation = secondFriendRelation || friends.secondFriendRelation;
        friends.secondFriendContact = secondFriendContact || friends.secondFriendContact;
        friends.secondFriendAddress = secondFriendAddress || friends.secondFriendAddress;

        await friends.save();

        res.status(200).json({
            message: 'Friends updated successfully',
            data: friends
        });
    } catch (error) {
        console.error('Error updating Friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteFriends = async (req, res) => {
    try {
        const { friendsId } = req.body;

        if (!ObjectId.isValid(friendsId)) {
            return res.status(400).json({ message: 'Invalid Friends ID' });
        }

        const friends = await Friends.findById(friendsId);
        if (!friends) {
            return res.status(404).json({ message: 'Friends not found' });
        }

        await friends.remove();

        res.status(200).json({ message: 'Friends deleted successfully' });
    } catch (error) {
        console.error('Error deleting Friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
