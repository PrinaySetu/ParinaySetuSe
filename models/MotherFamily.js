const mongoose = require('mongoose')
const mamaSchema= new mongoose.Schema({
    mamaName:{
        type:String
    },
    mamaAge:{
        type:Number
    },
    mamaStatus:{
        type:Boolean,
        default:false
    }

})
const mausiSchema= new mongoose.Schema({
    mausiName:{
        type:String
    },
    mausiAge:{
        type:Number
    },
    mausiStatus:{
        type:Boolean,
        default:false
    }


})

const MotherFamilySchema = new mongoose.Schema({
    grandMother:{
        type:String
    },
    grandMother:{
        type:String
    },
    grandMotherAge:{
        type:Number
    },
    grandMotherAge:{
        type:Number
    },
    grandMotherStatus:{
        type:Boolean,
        default:false
    },
    grandMotherStatus:{
        type:Boolean,
        default:false
    },
    mama:[mamaSchema],
    mausi:[mausiSchema],
    
})
module.exports = mongoose.model('MotherFamily',MotherFamilySchema)