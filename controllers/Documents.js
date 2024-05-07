const {uploadImageToCloudinary} = require('../utils/imageUploader');

const Documents = require('../models/Documents');
const Profile = require('../models/Profile');

exports.uploadDocuments = async (req, res) => {
    try {
        const { profileId } = req.body;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        const existProfile = await Profile.findById(profileId);
        if (!existProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Function to upload files to Cloudinary
        const uploadFiles = async (files) => {
            const uploadedFileUrls = [];

            for (const file of files) {
                const { path } = file;
                const uploaded = await uploadImageToCloudinary(path); // Upload file to Cloudinary
                uploadedFileUrls.push(uploaded.secure_url); // Push Cloudinary URL to array
            }

            return uploadedFileUrls;
        };

        // Extract files from req.files into respective categories
        const photos = req.files.filter(file => file.fieldname === 'photos');
        const familyPhotos = req.files.filter(file => file.fieldname === 'familyPhoto');
        const educationDocs = req.files.filter(file => file.fieldname === 'educationDocuments');
        const incomeProofs = req.files.filter(file => file.fieldname === 'incomeProofs');
        const propertyProofs = req.files.filter(file => file.fieldname === 'propertyProofs');
        const addressProofs = req.files.filter(file => file.fieldname === 'addressProofs');
        const idProofs = req.files.filter(file => file.fieldname === 'idProofs');
        const otherDocs = req.files.filter(file => file.fieldname === 'otherDocuments');

        // Upload files and get Cloudinary URLs for each category
        const uploadedPhotos = await uploadFiles(photos);
        const uploadedFamilyPhotos = await uploadFiles(familyPhotos);
        const uploadedEducationDocs = await uploadFiles(educationDocs);
        const uploadedIncomeProofs = await uploadFiles(incomeProofs);
        const uploadedPropertyProofs = await uploadFiles(propertyProofs);
        const uploadedAddressProofs = await uploadFiles(addressProofs);
        const uploadedIdProofs = await uploadFiles(idProofs);
        const uploadedOtherDocs = await uploadFiles(otherDocs);

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

        // Update the Profile with the new Documents ID
        // existProfile.documents.push(newDocuments._id);
        // await existProfile.save();
        const updatedProfile = await Profile.findByIdAndUpdate({
            _id: profileId
        },{
            $set: {
                documents: newDocuments._id
            }
        }, {new: true});
        
        return res.status(201).json({
            message: 'Documents uploaded successfully',
            documents: newDocuments
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload documents. Please try again."
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