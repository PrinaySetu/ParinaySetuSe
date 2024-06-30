const FamilyDetails = require('../models/FamilyDetails');
const Profile = require('../models/Profile');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');
exports.addFamilyDetails = async (req, res) => {
    try {
        const {
            fatherAge,
            fatherHealth,
            fatherDeathAge,
            fatherDeathYear,
            motherAge,
            motherHealth,
            motherDeathAge,
            motherDeathYear,
            brothers, // Array of brothers
            sisters   // Array of sisters
        } = req.body;

        console.log('Received data:', req.body); // Log the received data

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a familyDetails entry
        const profile = await Profile.findById(profileId).populate('familyDetails');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.familyDetails) {
            return res.status(400).json({ message: 'Family details entry already exists for this profile' });
        }

        // Create new FamilyDetails document
        const newFamilyDetails = new FamilyDetails({
            fatherAge,
            fatherHealth,
            fatherDeathAge,
            fatherDeathYear,
            motherAge,
            motherHealth,
            motherDeathAge,
            motherDeathYear,
            brother: brothers, // Assign array of brothers directly
            sister: sisters    // Assign array of sisters directly
        });

        await newFamilyDetails.save();

        // Update the Profile document to associate the new FamilyDetails
        profile.familyDetails = newFamilyDetails._id;
        await profile.save();

        res.status(200).json({
            message: 'Family Details added and profile updated successfully',
            data: newFamilyDetails
        });

    } catch (error) {
        console.error('Error adding family details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateFamilyDetails = async (req, res) => {
    try {
        const { fatherAge, 
            fatherHealth, fatherDeathAge, 
            fatherDeathYear, motherAge, 
            motherHealth, motherDeathAge, 
            motherDeathYear,
        brother: brothers, // Assign array of brothers directly
            sister: sisters } = req.body;

             // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('familyDetails');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Log the retrieved profile to debug if it has the correct education reference
        console.log("Retrieved profile:", profile);

        // Extract the familyDetailsId from the profile's familyDetails field
        const familyDetailsId = profile.familyDetails;
        console.log("This is familyDetailsId", familyDetailsId);

        if (!familyDetailsId) {
            return res.status(400).json({ message: 'familyDetailsId ID is required' });
        }

            if (!(familyDetailsId)) {
                return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
            }

            const familyDetails = await FamilyDetails.findById(familyDetailsId);
    
            if(!familyDetails){
                return res.status(404).json({message: 'FamilyDetails not found'});
            }
            familyDetails.fatherAge = fatherAge || familyDetails.fatherAge;
            familyDetails.fatherHealth = fatherHealth || familyDetails.fatherHealth;
            familyDetails.fatherDeathAge= fatherDeathAge || familyDetails.fatherDeathAge;
            familyDetails.fatherDeathYear = fatherDeathYear || familyDetails.fatherDeathYear;
            familyDetails.motherAge = motherAge || familyDetails.motherAge;
            familyDetails.motherHealth = motherHealth || familyDetails.motherHealth;
            familyDetails.motherDeathAge = motherDeathAge || familyDetails.motherDeathAge;
            familyDetails.motherDeathYear = motherDeathYear || familyDetails.motherDeathYear;
            familyDetails.brother = brothers || familyDetails.brother;
            familyDetails.sister = sisters || familyDetails.sister;
            await familyDetails.save();
            return res.status(200).json(
                {message: 'FamilyDetails updated successfully', 
                data: familyDetails
            });
    } catch (error) {
        console.error('Error updating FamilyDetails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updatebrother = async (req, res) => {
    try {
        const { brotherId, 
            name, age, health, deathAge, deathYear} = req.body;
             // Check if req.user and req.user.additionalDetails are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('familyDetails');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Log the retrieved profile to debug if it has the correct education reference
        console.log("Retrieved profile:", profile);

        // Extract the educationId from the profile's familyDetails field
        const familyDetailsId = profile.familyDetails;
        console.log("This is educationId", familyDetailsId);

        if (!familyDetailsId) {
            return res.status(400).json({ message: 'familyDetailsId ID is required' });
        }

        if (!(familyDetailsId)) {
            return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
        }
        if (!(brotherId)) {
            return res.status(400).json({ message: 'Invalid Brother ID' });
        }   
        const familyDetails = await FamilyDetails.findById(familyDetailsId);
        
        let brothers = familyDetails.brother;
        let index = brothers.findIndex((brother) => brother._id == brotherId);
        if(index === -1){
            return res.status(404).json({message: 'Brother not found'});
        }
        else{
            brothers[index].name = name || brothers[index].name;
            brothers[index].age = age || brothers[index].age;
            brothers[index].health = health || brothers[index].health;
            brothers[index].deathAge = deathAge || brothers[index].deathAge;
            brothers[index].deathYear = deathYear || brothers[index].deathYear;
            await familyDetails.save();
            return res.status(200).json(
                {message: 'Brother updated successfully', 
                data: familyDetails.brother
            });
        }  
    } catch (error) {
        console.error('Error updating Brother:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  
exports.updatesister = async (req, res) => {
    try {
        const {familyDetailsId, sisterId, 
            name, age, health, deathAge, deathYear} = req.body;
        if (!(familyDetailsId)) {
            return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
        }
        if (!(sisterId)) {
            return res.status(400).json({ message: 'Invalid sister ID' });
        }       
        const familyDetails = await FamilyDetails.findById(familyDetailsId);
        let sister = familyDetails.sister;
        let index = sister.findIndex((sister) => sister._id == sisterId);
        if(index === -1){
            return res.status(404).json({message: 'sister not found'});
        }
        else{
            sister[index].name = name ||sister[index].name;
            sister[index].age = age ||sister[index].age;
            sister[index].health = health ||sister[index].health;
            sister[index].deathAge = deathAge ||sister[index].deathAge;
            sister[index].deathYear = deathYear || sister[index].deathYear;
            await familyDetails.save();
            return res.status(200).json(
                {message: 'sister updated successfully', 
                data: familyDetails.sister
            });
        }  
    } catch (error) {
        console.error('Error updating Brother:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.removeSibling = async (req, res) => {
    try {
        const {familyId , siblingId} = req.body;
        if (!(familyId)) {
            return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
        }
        if (!(siblingId)) {
            return res.status(400).json({ message: 'Invalid Sibling ID' });
        }
        const familyDetails = await FamilyDetails.findById(familyId);
        if(!familyDetails) {
            return res.status(404).json({message: 'FamilyDetails not found'});
        }
        let removeIndex = familyDetails.siblings.findIndex((sibling) => sibling._id === siblingId);
        if(removeIndex==-1){
            return res.status(404).json({message: 'Sibling not found'});
        }else{
            familyDetails.siblings.splice(removeIndex, 1);
            await familyDetails.save();
            return res.status(200).json(
                {message: 'Sibling removed successfully', 
                data: familyDetails.siblings
            });
        }
    } catch (error) {
        console.error(error);
        return  res.status(500).json({message: 'Error removiung sibling'});
    }
}

exports.getUserFamilyDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
        if (!user || !user.additionalDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        const familyDetailsId = user.additionalDetails.familyDetails;
        if (!familyDetailsId) {
            return res.status(404).json({ message: 'FamilyDetails not found' });
        }
        const familyDetails = await FamilyDetails.findById(familyDetailsId).exec(); 
        if (!familyDetails) {
            return res.status(404).json({ message: 'FamilyDetails not found' });
        }
        return res.status(200).json({ message: 'FamilyDetails fetched successfully', data: familyDetails });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}






