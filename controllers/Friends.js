const Friends = require('../models/Friends');
const Profile = require('../models/Profile');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');


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

       if(profile.friends){
            return res.status(400).json({ message: 'Friends already exist for this profile' });
       }

        // Create a new friend
        const newFriend = Friends({
            firstFriendName,
            firstFriendRelation,
            firstFriendContact,
            firstFriendAddress,
            secondFriendName,
            secondFriendRelation,
            secondFriendContact,
            secondFriendAddress
        });

        await newFriend.save();
        profile.friends = newFriend._id;
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
            
            firstFriendName,
            firstFriendRelation,
            firstFriendContact,
            firstFriendAddress,
            secondFriendName,
            secondFriendRelation,
            secondFriendContact,
            secondFriendAddress
        } = req.body;

       // Check if req.user and req.user.additionalDetails are defined
       if (!req.user || !req.user.additionalDetails) {
        return res.status(400).json({ message: 'User details not found' });
    }

    // Retrieve the profile using the additionalDetails reference in the User schema
    const profile = await Profile.findById(req.user.additionalDetails).populate('education');
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    const friendsId = profile.friends;
    if (!friendsId) {
        return res.status(404).json({ message: 'Friends ID not found in profile' });
    }
    const existingFriends = await Friends.findById(friendsId);
        // Update the fields with the provided values (if not null/undefined)
        const updatedData = {
            firstFriendName :firstFriendName || existingFriends.firstFriendName,
            firstFriendRelation : firstFriendRelation || existingFriends.firstFriendRelation,
            firstFriendContact : firstFriendContact || existingFriends.firstFriendContact,
            firstFriendAddress : firstFriendAddress || existingFriends.firstFriendAddress,
            secondFriendName :secondFriendName || existingFriends.secondFriendName,
            secondFriendRelation: secondFriendRelation || existingFriends.secondFriendRelation,
            secondFriendContact : secondFriendContact || existingFriends.secondFriendContact,
            secondFriendAddress : secondFriendAddress || existingFriends.secondFriendAddress,

        }
       
       const updatedFriends = await Friends.findByIdAndUpdate(friendsId, updatedData, { new: true });

        res.status(200).json({
            message: 'Friends updated successfully',
            data: updatedFriends
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

exports.getUserFriends = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if (!user || !user.additionalDetails) {
            return res.status(404).json({ message: 'Additional details not found' });
        }
        const friendsId = user.additionalDetails.friends;
        if (!friendsId) {
            return res.status(404).json({ message: 'Friends ID not found in additional details' });
        }
        const friends = await Friends.findById(friendsId).exec();
        if (!friends) {
            return res.status(404).json({ message: 'Friends not found' });
        }
        return res.status(200).json({ message: 'Friends fetched successfully', data: friends });

    } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}