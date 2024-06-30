const {uploadImageToCloudinary} = require('../utils/imageUploader');

const Documents = require('../models/Documents');
const Profile = require('../models/Profile');
exports.uploadDocuments = async (req, res) => {
    console.log("Uploading documents");
    try {
        // console.log("Received files:", req.files);
        // console.log("Received body:", req.body);

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

        // Function to upload multiple files to Cloudinary
        const uploadFiles = async (files) => {
            if (!files) return [];
            const fileArray = Array.isArray(files) ? files : [files];
            const uploadPromises = fileArray.map(async (file) => {
                if (file && file.tempFilePath) {
                    try {
                        const uploaded = await uploadImageToCloudinary(file.tempFilePath);
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

        // Upload files and get Cloudinary URLs for each category
        const uploadedPhotos = await uploadFiles(req.files.photos);
        const uploadedFamilyPhotos = await uploadFiles(req.files.familyPhoto);
        const uploadedEducationDocs = await uploadFiles(req.files.educationDocuments);
        const uploadedIncomeProofs = await uploadFiles(req.files.incomeProofs);
        const uploadedPropertyProofs = await uploadFiles(req.files.propertyProofs);
        const uploadedAddressProofs = await uploadFiles(req.files.addressProofs);
        const uploadedIdProofs = await uploadFiles(req.files.idProofs);
        const uploadedOtherDocs = await uploadFiles(req.files.otherDocuments);

        // Create a new Documents document with uploaded file URLs
        const newDocuments = new Documents({
            photos: uploadedPhotos,
            familyPhoto: uploadedFamilyPhotos,
            educationDocuments: uploadedEducationDocs,
            incomeProofs: uploadedIncomeProofs,
            propertyProofs: uploadedPropertyProofs,
            addressProofs: uploadedAddressProofs,
            idProofs: uploadedIdProofs,
            otherDocuments: uploadedOtherDocs
        });

        // Save the new Documents document
        await newDocuments.save();

        // Update the profile to reference the new Documents entry
        profile.documents = newDocuments._id;
        await profile.save();

        return res.status(201).json({
            message: 'Documents uploaded successfully',
            documents: newDocuments
        });
    } catch (error) {
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
        // const { } = req.params;
        const { documentId ,category, files } = req.body;

        // Check if documentId is valid
        const existingDocument = await Documents.findById(documentId);
        if (!existingDocument) {
            return res.status(404).json({ message: 'Documents not found' });
        }

        // Function to upload files to Cloudinary and return URLs
        const uploadFiles = async (files) => {
            const uploadedFileUrls = [];

            for (const file of files) {
                const { path } = file;
                const uploaded = await uploadImageToCloudinary(path); // Upload file to Cloudinary
                uploadedFileUrls.push(uploaded.secure_url); // Push Cloudinary URL to array
            }
            console.log("Uploaded file URLs:", uploadedFileUrls);
            return uploadedFileUrls;
        };

        // Upload new files and get Cloudinary URLs
        const newFileUrls = await uploadFiles(files);

        // Update the existing document based on the specified category
        switch (category) {
            case 'photos':
                existingDocument.photos = existingDocument.photos.concat(newFileUrls);
                break;
            case 'familyPhoto':
                existingDocument.familyPhoto = existingDocument.familyPhoto.concat(newFileUrls);
                break;
            case 'educationDocuments':
                existingDocument.educationDocuments = existingDocument.educationDocuments.concat(newFileUrls);
                break;
            case 'incomeProofs':
                existingDocument.incomeProofs = existingDocument.incomeProofs.concat(newFileUrls);
                break;
            case 'propertyProofs':
                existingDocument.propertyProofs = existingDocument.propertyProofs.concat(newFileUrls);
                break;
            case 'addressProofs':
                existingDocument.addressProofs = existingDocument.addressProofs.concat(newFileUrls);
                break;
            case 'idProofs':
                existingDocument.idProofs = existingDocument.idProofs.concat(newFileUrls);
                break;
            case 'otherDocuments':
                existingDocument.otherDocuments = existingDocument.otherDocuments.concat(newFileUrls);
                break;
            default:
                return res.status(400).json({ message: 'Invalid category' });
        }

        // Save the updated document
        await existingDocument.save();

        return res.status(200).json({
            message: `Documents updated successfully in category: ${category}`,
            documents: existingDocument
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update documents. Please try again."
        });
    }
};