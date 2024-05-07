const Working = require('../models/working')
const Profile = require('../models/Profile')

exports.addWorking = async(req , res)=>{
    try {
        const {profileId ,incomeSource, employerName, natureWork, completedPeriod, annualIncome, otherSources, financialResponsibility, memberResponsibility} = req.body

        if(!ObjectId.isValid(profileId)){
            return res.status(400).json({message:'Profile ID is required'})
        }

        const newWorking = new Working({
            incomeSource, employerName, natureWork, completedPeriod, annualIncome, otherSources, financialResponsibility, memberResponsibility
        })

        await newWorking.save()

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$push:{working:newWorking._id}},
            {new:true}
        ).populate('working')

        res.status(200).json({
            message:'Working added and profile updated successfully',
            data:updatedProfile
        })

    } catch (error) {
        console.error('Error adding working:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

// update working
exports.updateWorking = async (req , res)=>{
    try {
        const {workingId, incomeSource, employerName, natureWork, completedPeriod, annualIncome, otherSources, financialResponsibility, memberResponsibility} = req.body

        if(!ObjectId.isValid(workingId)){
            return res.status(400).json({message:'Invalid Working ID'})
        }

        const updatedWorking = await Working.findByIdAndUpdate(
            workingId,
            {incomeSource, employerName, natureWork, completedPeriod, annualIncome, otherSources, financialResponsibility, memberResponsibility},
            {new:true}
        )

        if(!updatedWorking){
            return res.status(404).json({message:'Working not found'})
        }

        res.status(200).json({
            message:'Working updated successfully',
            data:updatedWorking
        })

    } catch (error) {
        console.error('Error updating working:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

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