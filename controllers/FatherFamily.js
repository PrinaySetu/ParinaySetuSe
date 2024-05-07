const FatherFamily = require('../models/FatherFamily')
const Profile = require('../models/Profile')

exports.addFatherFamily = async(req , res)=>{
    try{
        const {
            profileId,
            grandFather,
            grandMother,
            grandFatherAge,
            grandMotherAge,
            tau,
            bua,
            chacha
        } = req.body

        if(!profileId){
            return res.status(400).json({message:'Profile ID is required'})
        }

        const newFatherFamily = new FatherFamily({
            grandFather,
            grandMother,
            grandFatherAge,
            grandMotherAge,
            tau,
            bua,
            chacha
        })

        await newFatherFamily.save()

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { $push: { fatherFamily: newFatherFamily._id } },
            { new: true }
        ).populate('fatherFamily')

        res.status(200).json({
            message: 'Father Family added and profile updated successfully',
            data: updatedProfile
        })

    }catch(error){
        console.error('Error adding father family:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.updateFatherFamily = async(req , res)=>{
    try{
        const {fatherFamilyId , grandFather, grandMother, grandFatherAge, grandMotherAge, tau, bua, chacha} = req.body

        if(!fatherFamilyId){
            return res.status(400).json({message:'Father Family ID is required'})
        }

        const updatedFatherFamily = await FatherFamily.findByIdAndUpdate(
            fatherFamilyId,
            { $set: { grandFather, grandMother, grandFatherAge, grandMotherAge, tau, bua, chacha } },
            { new: true }
        )

        res.status(200).json({
            message: 'Father Family updated successfully',
            data: updatedFatherFamily
        })

    }catch(error){
        console.error('Error updating father family:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.updateTau = async(req , res)=>{
    try {
        const {fatherFamilyId, tauId, tauName , tauAge , tauStatus}= req.body;
        if(!ObjectID.isValid(fatherFamilyId)){
            return res.status(400).json({message:'Invalid Father Family ID'})
        }
        if(!ObjectID.isValid(tauId)){
            return res.status(400).json({message:'Invalid Tau ID'})

        }
        let tau = FatherFamily.tau;
        let index = tau.findIndex(tau => tau._id == tauId);
        if (index > -1) {
            tau[index].tauName = tauName || tau[index].tauName;
            tau[index].tauAge = tauAge || tau[index].tauAge;
            tau[index].tauStatus = tauStatus || tau[index].tauStatus;
        } else {
            return res.status(404).json({ message: 'Tau not found' });
        }
        const updatedFatherFamily = await FatherFamily.findByIdAndUpdate(
            fatherFamilyId,
            {$set:{tau : tau}},
            {new:true}
        );
        
        res.status(200).json({
            message:"Tau has been updated",
            data:updatedFatherFamily.tau[index]
        })
    } catch (error) {
        console.error('Error updating Tau:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateBua = async(req , res)=>{
    try {
        const {fatherFamilyId, buaId, buaName , buaAge , buaStatus}= req.body;
        if(!ObjectID.isValid(fatherFamilyId)){
            return res.status(400).json({message:'Invalid Father Family ID'})
        }
        if(!ObjectID.isValid(tauId)){
            return res.status(400).json({message:'Invalid Tau ID'})

        }
        let bua = FatherFamily.bua;
        let index = bua.findIndex(bua => bua._id == buaId);
        if (index > -1) {
            bua[index].buaName = buaName || tau[index].buaName;
            bua[index].buaAge = buaAge || bua[index].buaAge;
            bua[index].buaStatus = buaStatus || bua[index].buaStatus;
        } else {
            return res.status(404).json({ message: 'Tau not found' });
        }
        const updatedFatherFamily = await FatherFamily.findByIdAndUpdate(
            fatherFamilyId,
            {$set:{bua : bua}},
            {new:true}
        );
        
        res.status(200).json({
            message:"bua has been updated",
            data:updatedFatherFamily.bua[index]
        })
    } catch (error) {
        console.error('Error updating bua:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}