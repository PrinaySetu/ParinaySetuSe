const MotherFamily = require('../models/MotherFamily')
const Profile = require('../models/Profile')
const User = require('../models/User')

exports.addMotherFamily = async (req, res) => {
    try {
        const{
            grandMother,
            grandMotherAge,
            mama,
            mausi
        } = req.body;
         // Ensure the user and profile ID are defined
         if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a fatherFamily entry
        const profile = await Profile.findById(profileId).populate('motherFamily');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        if(profile.motherFamily){
            return res.status(400).json({message: 'Mother family details already exist for this profile'})
        }
        const newMotherFamily = new MotherFamily({
            grandMother,
            grandMotherAge,
            mama:mama,
            mausi:mausi
        });
        await newMotherFamily.save();
        profile.motherFamily = newMotherFamily._id;
        await profile.save();
        res.status(200).json({
            message: 'Mother Family added and profile updated successfully',
            data: newMotherFamily
        });
        }
        catch (error) {
            console.error('Error adding mother family:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } 
   
exports.updateMotherFamily = async (req, res) => {
    try {
        const {
            grandMother,
            grandMotherAge,
            grandMotherStatus,
            mama:mama,
            mausi:mausi
        } = req.body;
        // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('fatherFamily');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const motherFamilyId = profile.motherFamily;
        if (!motherFamilyId) {
            return res.status(400).json({ message: 'Mother Family ID is required' });
        }
        const motherFamily = await MotherFamily.findById(motherFamilyId);
        if (!motherFamily) {
            return res.status(404).json({ message: 'Mother Family not found' });
        }
       const updatedData = {
        grandMother: grandMother||motherFamily.grandMother,
            grandMotherAge:  grandMotherAge||motherFamily.grandMotherAge,
            grandMotherStatus: grandMotherStatus||motherFamily.grandMotherStatus,
            mama:mama||motherFamily.mama,
            mausi:mausi||motherFamily.mausi
       }
       const updatedMotherFamily = await MotherFamily.findByIdAndUpdate(motherFamilyId, updatedData, { new: true });
        res.status(200).json({
            message: 'Mother Family updated successfully',
            data: updatedMotherFamily
        });
    } catch (error) {
        console.error('Error updating mother family:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getUserMotherFamily = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if (!user || !user.additionalDetails) {
            return res.status(404).json({ message: 'Additional details not found' });
        }
        const motherFamilyId = user.additionalDetails.motherFamily;
        if (!motherFamilyId) {
            return res.status(404).json({ message: 'Father Family ID not found in additional details' });
        }
        const motherFamily = await MotherFamily.findById(motherFamilyId).exec();
        if (!motherFamily) {
            return res.status(404).json({ message: 'Mother Family not found' });
        }
        return res.status(200).json({ message: 'Mother Family fetched successfully', data: motherFamily });


    } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}