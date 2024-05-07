const mongoose = require('mongoose')

const RelativesSchema = new mongoose.Schema({
    firstRelativeName:{
        type:String
    },
    firstRelativeRelation:{
        type:String
    },
    firstRelativeContact:{
        type:Number
    },
    firstRelativeAddress:{
        type:String
    },
    
    secondRelativeName:{
        type: String,
    },  
    secondRelativeRelation:{
        type:String
    },
    secondRelativeContact:{
        type:Number
    },
    secondRelativeAddress:{
        type:String
    },
})
module.exports = mongoose.model('Relatives', RelativesSchema)