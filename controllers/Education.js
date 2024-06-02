const Education = require('../models/education')
const Profile = require('../models/Profile');
exports.addEducation = async (req, res) => {
    try {
        const {seconday, secondayYear, 
            secondayBoard, secondayMarks, 
            seniorSecondary, seniorSecondaryYear, 
            seniorSecondaryBoard, seniorSecondaryMarks, 
            graduation, graduationYear, universityName,
             graduationMarks, postGraduation, 
             postGraduationYear, 
             postGraduationUniversityName, 
             postGraduationMarks, other, diploma, 
             diplomaYear, diplomaBoard, 
             diplomaMarks} = req.body;
             
             const profileId = req.user.additionalDetails._id;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });}
        const newEducation = new Education({
            seconday, secondayYear, 
            secondayBoard, secondayMarks, 
            seniorSecondary, seniorSecondaryYear, 
            seniorSecondaryBoard, seniorSecondaryMarks, 
            graduation, graduationYear, universityName,
             graduationMarks, postGraduation, 
             postGraduationYear, 
             postGraduationUniversityName, 
             postGraduationMarks, other, diploma, 
             diplomaYear, diplomaBoard, 
             diplomaMarks
        });
         await newEducation.save();
         const updatedProfile = await Profile.findByIdAndUpdate(
             {_id:profileId},
            {
                $push:{
                    education:newEducation._id
                }
            },{new:true})
            return res.status(200).json({ message: 'Education added successfully', data: newEducation });
            
         
    } catch (error) {
        // console.log('Error in addEducation', error);
        console.log("This is user",req.user)
        return res.status(500).json({ message: 'Cannot add education details',  });
    }
}

exports.updateEducation = async (req, res) => {
    try {
        const {educationId, seconday, secondayYear, 
            secondayBoard, secondayMarks, 
            seniorSecondary, seniorSecondaryYear, 
            seniorSecondaryBoard, seniorSecondaryMarks, 
            graduation, graduationYear, universityName,
             graduationMarks, postGraduation, 
             postGraduationYear, 
             postGraduationUniversityName, 
             postGraduationMarks, other, diploma, 
             diplomaYear, diplomaBoard, 
             diplomaMarks} = req.body;

            if(!educationId){
                return res.status(400).json({message: 'Education ID is required'});
            }

        const education = await Education.findById(educationId);
        if(!education){
            return res.status(404).json({message: 'Education not found'});
        }

        education.seconday = seconday || education.seconday;
        education.secondayYear = secondayYear || education.secondayYear;
        education.secondayBoard = secondayBoard || education.secondayBoard;
        education.secondayMarks = secondayMarks || education.secondayMarks;
        education.seniorSecondary = seniorSecondary || education.seniorSecondary;
        education.seniorSecondaryYear = seniorSecondaryYear || education.seniorSecondaryYear;
        education.graduation = graduation || education.graduation;
        education.graduationYear = graduationYear || education.graduationYear;
        education.universityName = universityName || education.universityName;
        education.graduationMarks = graduationMarks || education.graduationMarks;
        education.postGraduation = postGraduation || education.postGraduation;
        education.postGraduationYear = postGraduationYear || education.postGraduationYear;
        education.postGraduationUniversityName = postGraduationUniversityName || education.postGraduationUniversityName;
        education.postGraduationMarks = postGraduationMarks || education.postGraduationMarks;
        education.other = other || education.other;
        await education.save();
        return res.status(200).json(
            {message: 'Education updated successfully', 
            data: education});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error in updating education"})

    }
}

// exports.deleteEducation = async (req, res) => {
//     try {
//         const {educationId} = req.params;
//         if(!educationId){
//             return res.status(400).json({message: 'Education ID is required'});
//         }
//         const education = await Education.findById(educationId);
//         if(!education){
//             return res.status(404).json({message: 'Education not found'});
//         }
//         await education.remove();
//         return res.status(200).json({message: 'Education deleted successfully'});
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({message: "Error in deleting education"})
//     }
// }