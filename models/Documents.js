const mongoose = require('mongoose')

const DocumentsSchema= new mongoose.Schema({
    photos:[{
        type: String
    }],
    familyPhoto:[{
        type: String
    }],
    educationDocuments:[{
        type: String
    }],
    incomeProofs:[{
        type: String
    }],
    propertyproofs:[{
        type: String
    }],
    addressProofs:[{
        type: String
    }],
    idProofs:[{
        type: String
    }],
    otherDocuments:[{
        type: String
    }],
})
module.exports = mongoose.model('Documents', DocumentsSchema)