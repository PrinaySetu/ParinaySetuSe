const FamilyDetails = require('../models/FamilyDetails');
const Profile = require('../models/Profile');

exports.addFamilyDetails = async (req, res) => {
    try {
        const {
            profileId,
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

        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
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
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { $push: { familyDetails: newFamilyDetails._id } },
            { new: true }
        ).populate('familyDetails');

        res.status(200).json({
            message: 'Family Details added and profile updated successfully',
            data: updatedProfile
        });

    } catch (error) {
        console.error('Error adding family details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateFamilyDetails = async (req, res) => {
    try {
        const {familyDetailsId , fatherAge, 
            fatherHealth, fatherDeathAge, 
            fatherDeathYear, motherAge, 
            motherHealth, motherDeathAge, 
            motherDeathYear} = req.body;
            if (!ObjectID.isValid(familyDetailsId)) {
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
        const {familyDetailsId, brotherId, 
            name, age, health, deathAge, deathYear} = req.body;
        if (!ObjectID.isValid(familyDetailsId)) {
            return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
        }
        if (!ObjectID.isValid(brotherId)) {
            return res.status(400).json({ message: 'Invalid Brother ID' });
        }       
        
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
        if (!ObjectID.isValid(familyDetailsId)) {
            return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
        }
        if (!ObjectID.isValid(sisterId)) {
            return res.status(400).json({ message: 'Invalid sister ID' });
        }       
        
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
        if (!ObjectID.isValid(familyId)) {
            return res.status(400).json({ message: 'Invalid FamilyDetails ID' });
        }
        if (!ObjectID.isValid(siblingId)) {
            return res.status(400).json({ message: 'Invalid Sibling ID' });
        }
        const familyDetails = await FamilyDetails.findById(familyId);
        if(!familyDetails) {
            return res.status(404).json({message: 'FamilyDetails not found'});
        }
        let removeIndex = familyDetails.siblings.findIndex((sibling) => sibling._id == siblingId);
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








