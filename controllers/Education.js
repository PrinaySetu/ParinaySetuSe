const Education = require('../models/education')
const Profile = require('../models/Profile');
const User = require('../models/User');
exports.addEducation = async (req, res) => {
    try {
        const {
            secondary, secondaryYear, secondaryBoard, secondaryMarks,
            seniorSecondary, seniorSecondaryYear, seniorSecondaryBoard, seniorSecondaryMarks,
            graduation, graduationYear, universityName, graduationMarks,
            postGraduation, postGraduationYear, postGraduationUniversityName, postGraduationMarks,
            other, diploma, diplomaYear, diplomaBoard, diplomaMarks
        } = req.body;

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has an education entry
        const profile = await Profile.findById(profileId).populate('education');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.education) {
            return res.status(400).json({ message: 'Education entry already exists for this profile' });
        }

        // Create a new education entry
        const newEducation = new Education({
            secondary, secondaryYear, secondaryBoard, secondaryMarks,
            seniorSecondary, seniorSecondaryYear, seniorSecondaryBoard, seniorSecondaryMarks,
            graduation, graduationYear, universityName, graduationMarks,
            postGraduation, postGraduationYear, postGraduationUniversityName, postGraduationMarks,
            other, diploma, diplomaYear, diplomaBoard, diplomaMarks
        });

        // Save the new education entry
        await newEducation.save();

        // Update the profile to reference the new education entry
        profile.education = newEducation._id;
        await profile.save();

        return res.status(200).json({ message: 'Education added successfully', data: newEducation });
    } catch (error) {
        console.error("Error in addEducation:", error);
        return res.status(500).json({ message: 'Cannot add education details' });
    }
};


exports.updateEducation = async (req, res) => {
    try {
        // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('education');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Extract the educationId from the profile's education field
        const educationId = profile.education;
        if (!educationId) {
            return res.status(400).json({ message: 'Education ID is required' });
        }

        // Fetch existing education data
        const existingEducation = await Education.findById(educationId);
        if (!existingEducation) {
            return res.status(404).json({ message: 'Education not found' });
        }

        // Destructure req.body for the fields that need to be updated
        const {
            secondary, secondaryYear, secondaryBoard, secondaryMarks,
            seniorSecondary, seniorSecondaryYear, seniorSecondaryBoard, seniorSecondaryMarks,
            graduation, graduationYear, universityName, graduationMarks,
            postGraduation, postGraduationYear, postGraduationUniversityName, postGraduationMarks,
            other, diploma, diplomaYear, diplomaBoard, diplomaMarks
        } = req.body;

        // Merge existing data with new data
        const updatedData = {
            secondary: secondary || existingEducation.secondary,
            secondaryYear: secondaryYear || existingEducation.secondaryYear,
            secondaryBoard: secondaryBoard || existingEducation.secondaryBoard,
            secondaryMarks: secondaryMarks || existingEducation.secondaryMarks,
            seniorSecondary: seniorSecondary || existingEducation.seniorSecondary,
            seniorSecondaryYear: seniorSecondaryYear || existingEducation.seniorSecondaryYear,
            seniorSecondaryBoard: seniorSecondaryBoard || existingEducation.seniorSecondaryBoard,
            seniorSecondaryMarks: seniorSecondaryMarks || existingEducation.seniorSecondaryMarks,
            graduation: graduation || existingEducation.graduation,
            graduationYear: graduationYear || existingEducation.graduationYear,
            universityName: universityName || existingEducation.universityName,
            graduationMarks: graduationMarks || existingEducation.graduationMarks,
            postGraduation: postGraduation || existingEducation.postGraduation,
            postGraduationYear: postGraduationYear || existingEducation.postGraduationYear,
            postGraduationUniversityName: postGraduationUniversityName || existingEducation.postGraduationUniversityName,
            postGraduationMarks: postGraduationMarks || existingEducation.postGraduationMarks,
            other: other || existingEducation.other,
            diploma: diploma || existingEducation.diploma,
            diplomaYear: diplomaYear || existingEducation.diplomaYear,
            diplomaBoard: diplomaBoard || existingEducation.diplomaBoard,
            diplomaMarks: diplomaMarks || existingEducation.diplomaMarks
        };

        // Update the education document in the database
        const updatedEducation = await Education.findByIdAndUpdate(
            educationId,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            message: 'Education updated successfully',
            data: updatedEducation
        });

    } catch (error) {
        console.error("Error in updateEducation:", error);
        return res.status(500).json({ message: "Error in updating education" });
    }
};
 exports.getUserEducation = async(req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if(!user || !user.additionalDetails){
            return res.status(404).json({message: 'Additional details not found'});
        }
        const educationId = user.additionalDetails.education;
        // console.log("This is id", educationId);
        if(!educationId){
            return res.status(404).json({message: 'Education ID not found in additional details'});
        }
        const education = await Education.findById(educationId).exec();
        if(!education){
            return res.status(404).json({message: 'Education not found'});
        }
        return res.status(200).json({message: 'Education fetched successfully', data: education});

    } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message,
        });
    }
 }

