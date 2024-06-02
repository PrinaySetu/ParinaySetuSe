const Contacts = require('../models/Contacts');
const Profile = require('../models/Profile');
exports.createContacts = async(req , res)=>{
    try {
        const {contactNumber, facebook, instagram, whatsappNumber, backupContact, permanentAddress, currentAddress} = req.body;
        const profileId = req.user.additionalDetails._id;
        if(!profileId) return res.status(400).json({message: 'Profile ID is required'});
        const newContact = new Contacts({
            contactNumber, facebook, instagram, whatsappNumber, backupContact, permanentAddress, currentAddress
        });
         await newContact.save();
        const profile = await Profile.findByIdAndUpdate(profileId,
             { $push :{ contacts: newContact._id}}, {new: true});
         return res.status(201).json({message: 'Contact created successfully', 
            contacts: newContact
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Contacts can't be added. Please try again."
        });
    }
}

exports.updateContacts = async (req, res) => {
    try {
        // const { contactId } = req.params; // Extract contactId from request parameters
        const {
            contactId,
            contactNumber,
            facebook,
            instagram,
            whatsappNumber,
            backupContact,
            permanentAddress,
            currentAddress
        } = req.body;

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