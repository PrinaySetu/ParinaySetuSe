// const Profile = require('../models/Profile');

const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.createProfile = async (req, res) => {
  try {
    // Extract profile data from the request body
    const {
      fatherName,
      motherName,
      guardianName,
      guardianRelation,
      birthDate,
      birthPlace,
      birthTime,
      gender,
      height,
      weight,
      bloodGroup,
      color,
      feast,
      previousDisease,
      identityMark,
      maritalStatus,
      residenceType,
      gotra,
      gotraMama,
      religion,
      caste,
      upcaste,
      manglikStatus
    } = req.body;
    
    const id = req.user.id;

    // Find the user by id
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Create a new profile data object
    const profileData = {
      fatherName: fatherName ? fatherName.trim() : undefined,
      motherName: motherName ? motherName.trim() : undefined,
      guardianName: guardianName ? guardianName.trim() : undefined,
      guardianRelation: guardianRelation ? guardianRelation.trim() : undefined,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      birthPlace: birthPlace ? birthPlace.trim() : undefined,
      birthTime: birthTime ? birthTime.trim() : undefined,
      gender: gender ? gender.trim() : undefined,
      height: height ? height.trim() : undefined,
      weight: weight ? weight.trim() : undefined,
      bloodGroup: bloodGroup ? bloodGroup.trim() : undefined,
      color: color ? color.trim() : undefined,
      feast: feast ? feast.trim() : undefined,
      previousDisease: previousDisease ? previousDisease.trim() : undefined,
      identityMark: identityMark ? identityMark.trim() : undefined,
      maritalStatus: maritalStatus ? maritalStatus.trim() : undefined,
      residenceType: residenceType ? residenceType.trim() : undefined,
      gotra: gotra ? gotra.trim() : undefined,
      gotraMama: gotraMama ? gotraMama.trim() : undefined,
      religion: religion ? religion.trim() : undefined,
      caste: caste ? caste.trim() : undefined,
      upcaste: upcaste ? upcaste.trim() : undefined,
      manglikStatus: manglikStatus === true // Defaults to false if not explicitly set to true
    };

    // Remove undefined values from profileData
    Object.keys(profileData).forEach(key => profileData[key] === undefined ? delete profileData[key] : {});

    // Create a new profile instance
    const newProfile = new Profile(profileData);

    // Save the new profile to the database
    const savedProfile = await newProfile.save();

    // Update user's additionalDetails field with the ID of the newly created profile
    userDetails.additionalDetails = savedProfile._id;
    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile Created Successfully",
      data: savedProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.updateProfile = async (req, res) => {
    
    try {
      if (!req.user || !req.user.additionalDetails) {
        return res.status(400).json({ message: 'User details not found' });
    }

    // Retrieve the profile using the additionalDetails reference in the User schema
    const profile = await Profile.findById(req.user.additionalDetails).populate('education');
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
     
  
  
      // Extract updated profile data from the request body
      const {
        fatherName,
        motherName,
        guardianName,
        guardianRelation,
        birthDate,
        birthPlace,
        birthTime,
        gender,
        height,
        weight,
        bloodGroup,
        color,
        feast,
        previousDisease,
        identityMark,
        maritalStatus,
        residenceType,
        gotra,
        gotraMama,
        religion,
        caste,
        upcaste,
        manglikStatus
      } = req.body;
  
      // Update profile fields with provided data
      profile.fatherName = fatherName ? fatherName.trim() : profile.fatherName;
      profile.motherName = motherName ? motherName.trim() : profile.motherName;
      profile.guardianName = guardianName ? guardianName.trim() : profile.guardianName;
      profile.guardianRelation = guardianRelation ? guardianRelation.trim() : profile.guardianRelation;
      profile.birthDate = birthDate ? new Date(birthDate) : profile.birthDate;
      profile.birthPlace = birthPlace ? birthPlace.trim() : profile.birthPlace;
      profile.birthTime = birthTime ? birthTime.trim() : profile.birthTime;
      profile.gender = gender ? gender.trim() : profile.gender;
      profile.height = height ? height.trim() : profile.height;
      profile.weight = weight ? weight.trim() : profile.weight;
      profile.bloodGroup = bloodGroup ? bloodGroup.trim() : profile.bloodGroup;
      profile.color = color ? color.trim() : profile.color;
      profile.feast = feast ? feast.trim() : profile.feast;
      profile.previousDisease = previousDisease ? previousDisease.trim() : profile.previousDisease;
      profile.identityMark = identityMark ? identityMark.trim() : profile.identityMark;
      profile.maritalStatus = maritalStatus ? maritalStatus.trim() : profile.maritalStatus;
      profile.residenceType = residenceType ? residenceType.trim() : profile.residenceType;
      profile.gotra = gotra ? gotra.trim() : profile.gotra;
      profile.gotraMama = gotraMama ? gotraMama.trim() : profile.gotraMama;
      profile.religion = religion ? religion.trim() : profile.religion;
      profile.caste = caste ? caste.trim() : profile.caste;
      profile.upcaste = upcaste ? upcaste.trim() : profile.upcaste;
      profile.manglikStatus = manglikStatus === true; // Set to true if explicitly provided
  
      // Save the updated profile to the database
      const updatedProfile = await profile.save();
  
      // Respond with the updated profile data
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  const Profile = require('../models/Profile');
  const User = require('../models/User')
exports.deleteProfile = async (req, res) => {
  const { id } = req.params; // Extract profile ID from request parameters

  try {
    // Find the profile by ID in the database
    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Delete the profile from the database
    await profile.remove();

    // Respond with success message
    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
exports.getProfileById = async (req, res) => {
    const { id } = req.params; // Extract profile ID from request parameters
  
    try {
      // Find the profile by ID in the database
      const profile = await Profile.findById(id);
  
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
  
      // Respond with the retrieved profile data
      return res.status(200).json({
        success: true,
        profile
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }
  };

  exports.addRecommendedProfile = async (req, res) => {
    const { id } = req.body; // Extract profile ID from request body
    const { recommendedProfileIds } = req.body; // Extract recommended profile IDs from request body
  
    console.log("Received ID:", id);
    console.log("Received Recommended Profile IDs:", recommendedProfileIds);
  
    try {
      const user = await User.findById(id).populate('additionalDetails').exec();
      const profile = user.additionalDetails;
  
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
      }
  
      if (!Array.isArray(recommendedProfileIds)) {
        return res.status(400).json({
          success: false,
          message: 'Recommended profile IDs must be provided as an array',
        });
      }
  
      profile.recommendedProfiles.push(...recommendedProfileIds);
      const updatedProfile = await profile.save();
  
      console.log("Updated Profile:", updatedProfile);
  
      return res.status(200).json({
        success: true,
        message: 'Recommended profiles added successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error in adding recommended profiles:", error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };
  exports.updateRecommendedProfiles = async (req, res) => {
    const { id } = req.body; // Extract profile ID from request body
    const { recommendedProfileIds } = req.body; // Extract recommended profile IDs from request body
  
    console.log("Received ID:", id);
    console.log("Received Recommended Profile IDs:", recommendedProfileIds);
  
    try {
      const user = await User.findById(id).populate('additionalDetails').exec();
      const profile = user.additionalDetails;
  
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
      }
  
      if (!Array.isArray(recommendedProfileIds)) {
        return res.status(400).json({
          success: false,
          message: 'Recommended profile IDs must be provided as an array',
        });
      }
  
      // Replace existing recommendedProfiles array with the new one
      profile.recommendedProfiles = recommendedProfileIds;
      const updatedProfile = await profile.save();
  
      console.log("Updated Profile:", updatedProfile);
  
      return res.status(200).json({
        success: true,
        message: 'Recommended profiles updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error in updating recommended profiles:", error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };
  
  
exports.removeRecommendedProfile = async (req, res) => {
    const { id } = req.params; // Extract profile ID from request parameters
    const { profileIdToRemove } = req.body; // Extract profile ID to remove from recommendedProfiles
  
    try {
      // Find the profile by ID in the database
      const profile = await Profile.findById(id);
  
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
  
      // Check if the profileIdToRemove is provided
      if (!profileIdToRemove) {
        return res.status(400).json({
          success: false,
          message: 'Profile ID to remove must be provided'
        });
      }
  
      // Remove the specified profile ID from the recommendedProfiles array
      profile.recommendedProfiles = profile.recommendedProfiles.filter(
        profileId => profileId !== profileIdToRemove
      );
  
      // Save the updated profile to the database
      const updatedProfile = await profile.save();
  
      // Respond with the updated profile data
      return res.status(200).json({
        success: true,
        message: 'Profile ID removed from recommended profiles successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }
  };

  exports.getAllUserDetails = async (req, res) => {
    try {
      const id = req.user.id;
      const userDetails = await User.findById(id).populate({
        path: 'additionalDetails',
        populate: [
          { path: 'education' },
          { path: 'occupation' },
          { path: 'contacts' },
          { path: 'relatives' },
          { path: 'friends' },
          { path: 'familyDetails' },
          { path: 'fatherFamily' },
          { path: 'motherFamily' },
          { path: 'property' },
          { path: 'documents' },
          { path: 'special' },
        ],
      });
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User Data fetched successfully',
        data: userDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.getUserAdditionalDetails = async (req, res) => {
    try {
      const id = req.user.id;
      const user = await User.findById(id).populate('additionalDetails').exec();
  
      if (!user || !user.additionalDetails) {
        return res.status(404).json({
          success: false,
          message: 'Additional details not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Additional details fetched successfully',
        data: user.additionalDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


exports.showAllRecommendedProfiles = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).populate('additionalDetails').exec();

    if (!user || !user.additionalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Additional details not found',
      });
    }

    // const recommendedProfiles = await Profile.find({
    //   _id: { $in: user.additionalDetails.recommendedProfiles },
    // });
    const recommendedProfiles = await User.find({
      _id: { $in: user.additionalDetails.recommendedProfiles },
    }).populate('additionalDetails').exec();
    
    console.log('Recommended Profiles:', recommendedProfiles);
    res.status(200).json({
      success: true,
      message: 'Recommended profiles fetched successfully',
      data: recommendedProfiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
  

// Controller to get a single recommended profile
exports.getSingleRecommendedProfile = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the user by ID and populate the additional details
    const user = await User.findById(id).populate({
      path: 'additionalDetails',
      populate: [
        { path: 'education' },
        { path: 'occupation' },
        { path: 'contacts' },
        { path: 'relatives' },
        { path: 'friends' },
        { path: 'familyDetails' },
        { path: 'fatherFamily' },
        { path: 'motherFamily' },
        { path: 'property' },
        { path: 'documents' },
        { path: 'special' },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the additional details exist
    if (!user.additionalDetails) {
      return res.status(404).json({ success: false, message: 'Profile details not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  console.log(req.files);
  try {
    const id = req.user.id;
    const user = await User.findById(id).exec();
    
  const image = req.files.profilePicture;
  const result = await uploadImageToCloudinary(image);
  console.log(result);
  user.image = result.secure_url;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Profile picture uploaded successfully',
    data: result,
  });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,

    });
  }
}
