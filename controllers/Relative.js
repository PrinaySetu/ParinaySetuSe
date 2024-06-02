const Relative = require('../models/Relatives')
const Profile = require('../models/Profile')

exports.addRelative = async(req , res)=>{
    try {
        const {firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
            secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
        } = req.body
        
        const profileId = req.user.additionalDetails._id
        if(!ObjectId.isValid(profileId)){
            return res.status(400).json({message:'Profile ID is required'})
        }

        const newRelative = new Relative({
            firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
            secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
        })

        await newRelative.save()

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$push:{relative:newRelative._id}},
            {new:true}
        ).populate('relative')

        res.status(200).json({
            message:'Relative added and profile updated successfully',
            data:updatedProfile
        })

    } catch (error) {
        console.error('Error adding relative:', error)
        res.status(500).json({message:'Internal server error'})
    }
}
exports.updateRelative = async (req , res)=>{
    try {
        const {relativeId, firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
            secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
        } = req.body

        if(!ObjectId.isValid(relativeId)){
            return res.status(400).json({message:'Invalid Relative ID'})
        }

        const updatedRelative = await Relative.findByIdAndUpdate(
            relativeId,
            {firstRelativeName, firstRelativeRelation, firstRelativeContact, firstRelativeAddress,
                secondRelativeName, secondRelativeRelation, secondRelativeContact, secondRelativeAddress
            },
            {new:true}
        )

        if(!updatedRelative){
            return res.status(404).json({message:'Relative not found'})
        }

        res.status(200).json({
            message:'Relative updated successfully',
            data:updatedRelative
        })

    } catch (error) {
        console.error('Error updating relative:', error)
        res.status(500).json({message:'Internal server error'})
    }
}

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