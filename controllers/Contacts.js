const Contacts = require('../models/Contacts');
const Profile = require('../models/Profile');
const User = require('../models/User');
exports.createContacts = async (req, res) => {
    try {
        const { contactNumber, facebook, instagram, whatsappNumber, backupContact, permanentAddress, currentAddress } = req.body;

        // Ensure the user and profile ID are defined
        if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        const profileId = req.user.additionalDetails;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' });
        }

        // Check if the profile already has a contact entry
        const profile = await Profile.findById(profileId).populate('contacts');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.contacts) {
            return res.status(400).json({ message: 'Contact entry already exists for this profile' });
        }

        // Create a new contact entry
        const newContact = new Contacts({
            contactNumber, facebook, instagram, whatsappNumber, backupContact, permanentAddress, currentAddress
        });

        // Save the new contact entry
        await newContact.save();

        // Update the profile to reference the new contact entry
        profile.contacts = newContact._id;
        await profile.save();

        return res.status(201).json({ message: 'Contact created successfully', contacts: newContact });
    } catch (error) {
        console.error("Error in createContacts:", error);
        return res.status(500).json({ success: false, message: "Contacts can't be added. Please try again." });
    }
};

exports.updateContacts = async (req, res) => {
    try {
        // const { contactId } = req.params; // Extract contactId from request parameters
        const {
            
            contactNumber,
            facebook,
            instagram,
            whatsappNumber,
            backupContact,
            permanentAddress,
            currentAddress
        } = req.body;
         // Check if req.user and req.user.additionalDetails are defined
         if (!req.user || !req.user.additionalDetails) {
            return res.status(400).json({ message: 'User details not found' });
        }

        // Retrieve the profile using the additionalDetails reference in the User schema
        const profile = await Profile.findById(req.user.additionalDetails).populate('contacts');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Log the retrieved profile to debug if it has the correct education reference
        // console.log("Retrieved profile:", profile);

        // Extract the contactId from the profile's education field
        const contactId = profile.contacts;
        // console.log("This is contactId", contactId);

        if (!contactId) {
            return res.status(400).json({ message: 'contactId  is required' });
        }

        // const contactId = req.user.additionalDetails.contacts._id;

        // Find the contact by its ID
        const contact = await Contacts.findById(contactId);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Update the contact fields
        contact.contactNumber = contactNumber || contact.contactNumber;
        contact.facebook = facebook || contact.facebook;
        contact.instagram = instagram || contact.instagram;
        contact.whatsappNumber = whatsappNumber || contact.whatsappNumber;
        contact.backupContact = backupContact || contact.backupContact;
        contact.permanentAddress = permanentAddress || contact.permanentAddress;
        contact.currentAddress = currentAddress || contact.currentAddress;

        // Save the updated contact
        await contact.save();

        return res.status(200).json({
            message: 'Contact updated successfully',
            contacts: contact
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Contact update failed. Please try again."
        });
    }
};

// Server-side function
exports.getUserContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('additionalDetails').exec();
    
        if (!user || !user.additionalDetails) {
            return res.status(404).json({
                success: false,
                message: 'Additional details not found',
            });
        }
    
        const contactId = user.additionalDetails.contacts;
        // console.log("This is id", contactId);
        if (!contactId) {
            return res.status(404).json({
                success: false,
                message: 'Contacts ID not found in additional details',
            });
        }
    
        const contactDetails = await Contacts.findById(contactId).exec();
        if (!contactDetails) {
            return res.status(404).json({
                success: false,
                message: 'Contact details not found',
            });
        }
    
        res.status(200).json({
            success: true,
            message: 'Contact details fetched successfully',
            data: contactDetails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
