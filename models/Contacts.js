const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  
    contactNumber:{
        type: Number,
        required: true
    },
    facebook:{
        type:String
    },
    instagram:{
        type:String
    },
    whatsappNumber:{
        type:String
    },
    backupContact:{
        type:Number
    },
    permanentAddress:{
        type:String
    },
    currentAddress:{
        type:String
    }, 
      

})
module.exports = mongoose.model('Contact', contactSchema)