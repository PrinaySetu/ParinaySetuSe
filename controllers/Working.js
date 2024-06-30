const Working = require('../models/working')
const Profile = require('../models/Profile')
const User = require('../models/User')
const { ObjectId } = require('mongoose').Types;

exports.addWorking = async (req, res) => {
    try {
        const { incomeSource, employerName, natureWork, completedPeriod, 
            annualIncome, otherSources, financialResponsibility, 
            memberResponsibility } = req.body;

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!ObjectId.isValid(profileId)) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a working entry
        const profile = await Profile.findById(profileId).populate('occupation');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.working) {
            return res.status(400).json({ message: 'Working details already exist for this profile' });
        }

        // Create new Working document
        const newWorking = new Working({
            incomeSource, employerName, natureWork, completedPeriod, annualIncome, 
            otherSources, financialResponsibility, memberResponsibility
        });

        await newWorking.save();

        // Update the Profile document to associate the new Working
        profile.occupation = newWorking._id;
        await profile.save();

        res.status(200).json({
            message: 'Working added and profile updated successfully',
            data: newWorking
        });

    } catch (error) {
        console.error('Error adding working:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// update working
exports.updateWorking = async (req, res) => {
    try {
        const {
            incomeSource, employerName, natureWork, completedPeriod, annualIncome,
            otherSources, financialResponsibility, memberResponsibility
        } = req.body;

        // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('occupation');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Extract the workingId from the profile's occupation field
        const workingId = profile.occupation;
        if (!workingId) {
            return res.status(400).json({ message: 'Working ID is required' });
        }

        // Fetch existing working data
        const existingWorking = await Working.findById(workingId);
        if (!existingWorking) {
            return res.status(404).json({ message: 'Working not found' });
        }

        // Merge existing data with new data
        const updatedData = {
            incomeSource: incomeSource || existingWorking.incomeSource,
            employerName: employerName || existingWorking.employerName,
            natureWork: natureWork || existingWorking.natureWork,
            completedPeriod: completedPeriod || existingWorking.completedPeriod,
            annualIncome: annualIncome || existingWorking.annualIncome,
            otherSources: otherSources || existingWorking.otherSources,
            financialResponsibility: financialResponsibility || existingWorking.financialResponsibility,
            memberResponsibility: memberResponsibility || existingWorking.memberResponsibility
        };

        // Update the working document in the database
        const updatedWorking = await Working.findByIdAndUpdate(
            workingId,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            message: 'Working updated successfully',
            data: updatedWorking
        });

    } catch (error) {
        console.error('Error updating working:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// delete working by id
exports.deleteWorking = async (req , res)=>{
    try {
        const {profileId , workingId} = req.body

        if(!ObjectId.isValid(profileId) || !ObjectId.isValid(workingId)){
            return res.status(400).json({message:'Invalid Profile or Working ID'})
        }

        const working = await Working.findById(workingId)

        if(!working){
            return res.status(404).json({message:'Working not found'})
        }

        await Working.findByIdAndDelete(workingId)

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$pull:{working:workingId}},
            {new:true}
        ).populate('working')

        res.status(200).json({
            message:'Working deleted and profile updated successfully',
            data:updatedProfile
        })

    } catch (error) {
        console.error('Error deleting working:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

exports.getUserWorking = async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if(!user || !user.additionalDetails){
            return res.status(404).json({message:'Additional details not found'})
        }
        const workingId = user.additionalDetails.occupation;
        if(!workingId){
            return res.status(404).json({message:'Working ID not found in additional details'})
        }
        const working = await Working.findById(workingId).exec();
        if(!working){
            return res.status(404).json({message:'Working not found'})
        }
        return res.status(200).json({message:'Working fetched successfully', data:working})
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
