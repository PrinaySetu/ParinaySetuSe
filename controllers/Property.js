const Property = require('../models/Property')
const Profile = require('../models/Profile')

exports.addProperty = async(req , res)=>{
    try {
        const {houseOwner, houseAddress, housePrice , houseLoan , 
            flatOwner, flatAddress, flatType, flatPrice, flatLoan,
            landOwner, landAddress, landPrice, landLoan,
            farmingOwner, farmingAddress, farmingPrice, farmingLoan,
            shopOwner, shopAddress, shopPrice, shopLoan
        } = req.body
        const profileId = req.user.additionalDetails._id;
        if(!ObjectId.isValid(profileId)){
            return res.status(400).json({message:'Profile ID is required'})
        }

        const newProperty = new Property({
            houseOwner, houseAddress, housePrice , houseLoan , 
            flatOwner, flatAddress, flatType, flatPrice, flatLoan,
            landOwner, landAddress, landPrice, landLoan,
            farmingOwner, farmingAddress, farmingPrice, farmingLoan,
            shopOwner, shopAddress, shopPrice, shopLoan
        })

        await newProperty.save()

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {$push:{property:newProperty._id}},
            {new:true}
        ).populate('property')

        res.status(200).json({
            message:'Property added and profile updated successfully',
            data:updatedProfile
        })

    } catch (error) {
        console.error('Error adding property:', error)
        res.status(500).json({message:'Internal server error'})
    }
}



//To Do : Implement this function 
// exports.deletePropertyFromUserById= async(req , res)=>{
//     try {
//         const {profileId , propertyId} = req.body

//         if(!ObjectId.isValid(profileId) || !ObjectId.isValid(propertyId)){
//             return res.status(400).json({message:'Invalid Profile or Property ID'})
//         }

//         const property = await Property.findById(propertyId)

//         if(!property){
//             return res.status(404).json({message:'Property not found'})
//         }

//         await Property.findByIdAndDelete(propertyId)

//         const updatedProfile = await Profile.findByIdAndUpdate(
//             profileId,
//             {$pull:{property:propertyId}},
//             {new:true}
//         ).populate('property')

//         res.status(200).json({
//             message:'Property deleted and profile updated successfully',
//             data:updatedProfile
//         })

//     } catch (error) {
//         console.error('Error deleting property:', error)
//         res.status(500).json({message:'Internal server error'})
//     }
// }
exports.updateProperty = async(req , res)=>{
    try {
        const {houseOwner, houseAddress, housePrice , houseLoan , 
            flatOwner, flatAddress, flatType, flatPrice, flatLoan,
            landOwner, landAddress, landPrice, landLoan,
            farmingOwner, farmingAddress, farmingPrice, farmingLoan,
            shopOwner, shopAddress, shopPrice, shopLoan} = req.body

        if(!ObjectId.isValid(propertyId)|| !ObjectId.isValid(profileId)){
            return res.status(400).json({message:'Property ID or Profile Id is required'})
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            {$set:{houseOwner, houseAddress, housePrice , houseLoan , 
                flatOwner, flatAddress, flatType, flatPrice, flatLoan,
                landOwner, landAddress, landPrice, landLoan,
                farmingOwner, farmingAddress, farmingPrice, farmingLoan,
                shopOwner, shopAddress, shopPrice, shopLoan}},
            {new:true}
        )

        res.status(200).json({
            message:'Property updated successfully',
            data:updatedProperty
        })

    } catch (error) {
        console.error('Error updating property:', error)
        res.status(500).json({message:'Internal server error'})
    }
}