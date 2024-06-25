const Specials = require('../models/Specials')
const Profile = require('../models/Profile')
const User = require('../models/User')
const { ObjectId } = require('mongoose').Types;

exports.addSpecial = async (req, res) => {
    try {
        const { qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle } = req.body;
        
        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a special entry
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Check if profile.special is already defined
        if (profile.special) {
            return res.status(400).json({ message: 'Special details already exist for this profile' });
        }

        // Create new Specials document
        const newSpecial = new Specials({
            qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle
        });

        await newSpecial.save();

        // Update the Profile document to associate the new Specials
        profile.special = newSpecial._id;
        await profile.save();

        res.status(200).json({
            message: 'Special added and profile updated successfully',
            data: profile
        });

    } catch (error) {
        console.error('Error adding special:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateSpecials = async (req, res) => {
    try {
        const { qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle } = req.body;

        // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('special');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Log the retrieved profile to debug if it has the correct specialId reference
        console.log("Retrieved profile:", profile);

        // Extract the specialId from the profile's special field
        const specialId = profile.special;
        console.log("This is specialId:", specialId);

        if (!specialId) {
            return res.status(400).json({ message: 'Invalid specialId ID' });
        }

        // Fetch existing special data
        const existingSpecial = await Specials.findById(specialId);
        if (!existingSpecial) {
            return res.status(404).json({ message: 'Special not found' });
        }

        // Merge existing data with new data
        const updatedData = {
            qualities: qualities || existingSpecial.qualities,
            specificCaste: specificCaste || existingSpecial.specificCaste,
            likes: likes || existingSpecial.likes,
            dislikes: dislikes || existingSpecial.dislikes,
            intercaste: intercaste !== undefined ? intercaste : existingSpecial.intercaste, // Check for undefined explicitly for boolean fields
            hobbies: hobbies || existingSpecial.hobbies,
            lifeStyle: lifeStyle || existingSpecial.lifeStyle
        };

        // Update the special information
        const updatedSpecial = await Specials.findByIdAndUpdate(
            specialId,
            updatedData,
            { new: true }
        );

        res.status(200).json({
            message: 'Special updated successfully',
            data: updatedSpecial
        });

    } catch (error) {
        console.error('Error updating special:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteSpecial = async(req , res)=>{
    try {
        const {profileId ,specialId} = req.body

        if(!ObjectId.isValid(specialId)|| !ObjectId.isValid(profileId)){
            return res.status(400).json({message:'Invalid Special ID or Profile Id'})
        }

        const deletedSpecial = await Specials.findByIdAndDelete(specialId)

        if(!deletedSpecial){
            return res.status(404).json({message:'Special not found'})
        }
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$pull:{special:specialId}},
            {new:true}
        ).populate('special')

        res.status(200).json({
            message:'Special deleted successfully',
            data:deletedSpecial
        })

    } catch (error) {
        console.error('Error deleting special:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

exports.getUserSpecials = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if (!user || !user.additionalDetails) {
            return res.status(404).json({ message: 'Additional details not found' });
        }
        const specialId = user.additionalDetails.special;
        if (!specialId) {
            return res.status(404).json({ message: 'Special ID not found in additional details' });
        }
        const special = await Specials.findById(specialId).exec();
        if (!special) {
            return res.status(404).json({ message: 'Special not found' });
        }
        return res.status(200).json({ message: 'Special fetched successfully', data: special });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}