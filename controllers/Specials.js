const Specials = require('../models/Specials')
const Profile = require('../models/Profile')

exports.addSpecial = async(req , res)=>{
    try {
        const { qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle} = req.body
        const profileId = req.user.additionalDetails._id
        if(!ObjectId.isValid(profileId)){
            return res.status(400).json({message:'Profile ID is required'})
        }

        const newSpecial = new Specials({
            qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle
        })

        await newSpecial.save()

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$push:{special:newSpecial._id}},
            {new:true}
        ).populate('special')

        res.status(200).json({
            message:'Special added and profile updated successfully',
            data:updatedProfile
        })

    } catch (error) {
        console.error('Error adding special:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

exports.updateSpecials = async(req , res)=>{
    try {
        const {specialId, qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle} = req.body

        if(!ObjectId.isValid(specialId)){
            return res.status(400).json({message:'Invalid Special ID'})
        }

        const updatedSpecial = await Specials.findByIdAndUpdate(
            specialId,
            {qualities, specificCaste, likes, dislikes, intercaste, hobbies, lifeStyle},
            {new:true}
        )

        if(!updatedSpecial){
            return res.status(404).json({message:'Special not found'})
        }

        res.status(200).json({
            message:'Special updated successfully',
            data:updatedSpecial
        })

    } catch (error) {
        console.error('Error updating special:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

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