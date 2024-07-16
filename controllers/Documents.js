const {uploadImageToCloudinary} = require('../utils/imageUploader');

const Documents = require('../models/Documents');
const Profile = require('../models/Profile');
exports.uploadDocuments = async (req, res) => {
    console.log("Uploading documents");
    // console.log("Files ", req.files);
    try {
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        const profile = await Profile.findById(profileId).populate('documents');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.documents) {
            return res.status(400).json({ message: 'Documents entry already exists for this profile' });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }

        const uploadFiles = async (files) => {
            // console.log("Uploading files:", files);
            if (!files) return [];
            const uploadPromises = Object.values(files).map(async (file) => {
                if (file && file.tempFilePath) {
                    try {
                        const result = await uploadImageToCloudinary(file);
                        return result.secure_url;
                    } catch (error) {
                        console.error("Error uploading file to Cloudinary:", error);
                        return null;
                    }
                }
                return null;
            });
            return (await Promise.all(uploadPromises)).filter(url => url !== null);
        };

        const categories = ['photos', 'familyPhoto', 'educationDocuments', 'incomeProofs', 'propertyProofs', 'addressProofs', 'idProofs', 'otherDocuments'];
        const uploadedFiles = {};

        for (const category of categories) {
            const categoryFiles = Object.keys(req.files)
                .filter(key => key.startsWith(category))
                .reduce((obj, key) => {
                    obj[key] = req.files[key];
                    return obj;
                }, {});
            
            if (Object.keys(categoryFiles).length > 0) {
                uploadedFiles[category] = await uploadFiles(categoryFiles);
            } else {
                uploadedFiles[category] = [];
            }
        }

        const newDocuments = new Documents(uploadedFiles);

        await newDocuments.save();
        console.log("New Documents:", newDocuments);
        profile.documents = newDocuments._id;
        console.log("Profile:", profile);
        await profile.save();

        return res.status(201).json({
            message: 'Documents uploaded successfully',
            documents: newDocuments
        });
    } catch (error) {
        console.log("Error in uploadDocuments:", error);
        console.error("Error in uploadDocuments:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload documents. Please try again.",
            error: error.message
        });
    }
};

exports.updateDocuments = async (req, res) => {
    try {
        const { documentId } = req.params;
        
        const existingDocument = await Documents.findById(documentId);
        if (!existingDocument) {
            return res.status(404).json({ message: 'Documents not found' });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }

        const uploadFiles = async (files) => {
            if (!files) return [];
            const fileArray = Array.isArray(files) ? files : [files];
            const uploadPromises = fileArray.map(async (file) => {
                if (file && file.path) {
                    try {
                        const uploaded = await uploadImageToCloudinary(file.path);
                        return uploaded.secure_url;
                    } catch (error) {
                        console.error("Error uploading file to Cloudinary:", error);
                        return null;
                    }
                }
                return null;
            });
            return (await Promise.all(uploadPromises)).filter(url => url !== null);
        };

        const categories = ['photos', 'familyPhoto', 'educationDocuments', 'incomeProofs', 'propertyProofs', 'addressProofs', 'idProofs', 'otherDocuments'];

        for (const category of categories) {
            if (req.files[category]) {
                const newFileUrls = await uploadFiles(req.files[category]);
                existingDocument[category] = existingDocument[category].concat(newFileUrls);
            }
        }

        await existingDocument.save();

        return res.status(200).json({
            message: 'Documents updated successfully',
            documents: existingDocument
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update documents. Please try again.",
            error: error.message
        });
    }
};