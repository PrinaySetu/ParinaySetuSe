const Relative = require('../models/Relatives')
const Profile = require('../models/Profile')
const User = require('../models/User')
const { ObjectId } = require('mongoose').Types;

exports.addRelative = async (req, res) => {
    try {
        const {
            firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
            secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
        } = req.body;

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }
      
        const profileId = req.user.additionalDetails;
        if (!(profileId)) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a relative entry
        const profile = await Profile.findById(profileId).populate('relatives');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.relatives) {
            return res.status(400).json({ message: 'Relative details already exist for this profile' });
        }

        // Create new Relative document
        const newRelative = new Relative({
            firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
            secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
        });

        await newRelative.save();

        // Update the Profile document to associate the new Relative
        profile.relatives = newRelative._id;
        await profile.save();

        res.status(200).json({
            message: 'Relative added and profile updated successfully',
            data: newRelative
        });

    } catch (error) {
        console.error('Error adding relative:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateRelative = async (req, res) => {
    try {
        const {
            firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
            secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
        } = req.body;

        // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('relatives');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Extract the relativeId from the profile's relatives field
        const relativeId = profile.relatives;
        if (!relativeId) {
            return res.status(400).json({ message: 'Relative ID is required' });
        }

        // Fetch existing relative data
        const existingRelative = await Relative.findById(relativeId);
        if (!existingRelative) {
            return res.status(404).json({ message: 'Relative not found' });
        }

        // Merge existing data with new data
        const updatedData = {
            firstRelativeName: firstRelativeName || existingRelative.firstRelativeName,
            firstRelativeRelation: firstRelativeRelation || existingRelative.firstRelativeRelation,
            firstRelativeContact: firstRelativeContact || existingRelative.firstRelativeContact,
            firstRelativeAddress: firstRelativeAddress || existingRelative.firstRelativeAddress,
            secondRelativeName: secondRelativeName || existingRelative.secondRelativeName,
            secondRelativeRelation: secondRelativeRelation || existingRelative.secondRelativeRelation,
            secondRelativeContact: secondRelativeContact || existingRelative.secondRelativeContact,
            secondRelativeAddress: secondRelativeAddress || existingRelative.secondRelativeAddress
        };

        // Update the relative document in the database
        const updatedRelative = await Relative.findByIdAndUpdate(
            relativeId,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            message: 'Relative updated successfully',
            data: updatedRelative
        });

    } catch (error) {
        console.error('Error updating relative:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE RELATIVE API
exports.deleteRelative = async (req , res)=>{
    try {
        const {profileId , relativeId} = req.body

        if(!ObjectId.isValid(profileId) || !ObjectId.isValid(relativeId)){
            return res.status(400).json({message:'Invalid Profile or Relative ID'})
        }

        const relative = await Relative.findById(relativeId)

        if(!relative){
            return res.status(404).json({message:'Relative not found'})
        }

        await Relative.findByIdAndDelete(relativeId)

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$pull:{relative:relativeId}},
            {new:true}
        ).populate('relative')

        res.status(200).json({
            message:'Relative deleted and profile updated successfully',
            data:updatedProfile
        })

    } catch (error) {
        console.error('Error deleting relative:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

exports.getUserRelative = async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if(!user || !user.additionalDetails){
            return res.status(404).json({message: 'Additional details not found'});
        }
        const relativeId = user.additionalDetails.relatives;
        if(!relativeId){
            return res.status(404).json({message: 'Relative ID not found in additional details'});
        }
        const relative = await Relative.findById(relativeId).exec();
        if(!relative){
            return res.status(404).json({message: 'Relative not found'});
        }
        return res.status(200).json({message: 'Relative fetched successfully', data: relative});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}