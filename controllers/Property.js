const Property = require('../models/Property')
const Profile = require('../models/Profile')

const { ObjectId } = require('mongoose').Types;

exports.addProperty = async (req, res) => {
    try {
        const {
            houseOwner, houseAddress, housePrice, houseLoan,
            flatOwner, flatAddress, flatType, flatPrice, flatLoan,
            landOwner, landAddress, landPrice, landLoan,
            farmingOwner, farmingAddress, farmingPrice, farmingLoan,
            shopOwner, shopAddress, shopPrice, shopLoan
        } = req.body;

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!ObjectId.isValid(profileId)) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a property entry
        const profile = await Profile.findById(profileId).populate('property');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.property) {
            return res.status(400).json({ message: 'Property details already exist for this profile' });
        }

        // Create new Property document
        const newProperty = new Property({
            houseOwner, houseAddress, housePrice, houseLoan,
            flatOwner, flatAddress, flatType, flatPrice, flatLoan,
            landOwner, landAddress, landPrice, landLoan,
            farmingOwner, farmingAddress, farmingPrice, farmingLoan,
            shopOwner, shopAddress, shopPrice, shopLoan
        });

        await newProperty.save();

        // Update the Profile document to associate the new Property
        profile.property = newProperty._id;
        await profile.save();

        res.status(200).json({
            message: 'Property added and profile updated successfully',
            data: newProperty
        });

    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



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
exports.updateProperty = async (req, res) => {
    try {
        const {
            houseOwner, houseAddress, housePrice, houseLoan,
            flatOwner, flatAddress, flatType, flatPrice, flatLoan,
            landOwner, landAddress, landPrice, landLoan,
            farmingOwner, farmingAddress, farmingPrice, farmingLoan,
            shopOwner, shopAddress, shopPrice, shopLoan
        } = req.body;

        // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('property');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Extract the propertyId from the profile's property field
        const propertyId = profile.property;
        if (!propertyId) {
            return res.status(400).json({ message: 'Property ID is required' });
        }

        // Fetch existing property data
        const existingProperty = await Property.findById(propertyId);
        if (!existingProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Merge existing data with new data
        const updatedData = {
            houseOwner: houseOwner || existingProperty.houseOwner,
            houseAddress: houseAddress || existingProperty.houseAddress,
            housePrice: housePrice || existingProperty.housePrice,
            houseLoan: houseLoan || existingProperty.houseLoan,
            flatOwner: flatOwner || existingProperty.flatOwner,
            flatAddress: flatAddress || existingProperty.flatAddress,
            flatType: flatType || existingProperty.flatType,
            flatPrice: flatPrice || existingProperty.flatPrice,
            flatLoan: flatLoan || existingProperty.flatLoan,
            landOwner: landOwner || existingProperty.landOwner,
            landAddress: landAddress || existingProperty.landAddress,
            landPrice: landPrice || existingProperty.landPrice,
            landLoan: landLoan || existingProperty.landLoan,
            farmingOwner: farmingOwner || existingProperty.farmingOwner,
            farmingAddress: farmingAddress || existingProperty.farmingAddress,
            farmingPrice: farmingPrice || existingProperty.farmingPrice,
            farmingLoan: farmingLoan || existingProperty.farmingLoan,
            shopOwner: shopOwner || existingProperty.shopOwner,
            shopAddress: shopAddress || existingProperty.shopAddress,
            shopPrice: shopPrice || existingProperty.shopPrice,
            shopLoan: shopLoan || existingProperty.shopLoan
        };

        // Update the property document in the database
        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            message: 'Property updated successfully',
            data: updatedProperty
        });

    } catch (error) {
        console.error('Error updating property:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};