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

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!ObjectId.isValid(profileId)) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Find the profile
        let profile = await Profile.findById(profileId).populate('friends');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Check if the friend already exists for the profile
        let friendExist = profile.friends.some((friend) => friend.firstFriendName === firstFriendName);

        if (friendExist) {
            return res.status(400).json({ message: 'Friend already exists for this profile' });
        }

        // Create a new friend
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

        // Associate the new friend with the profile
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
