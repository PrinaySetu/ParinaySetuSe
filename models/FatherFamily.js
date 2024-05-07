const mongoose = require('mongoose')
const tauSchema= new mongoose.Schema({
    tauName:{
        type:String
    },
    tauAge:{
        type:Number
    },
    tauStatus:{
        type:Boolean,
        default:false
    }

})
const buaSchema= new mongoose.Schema({
    buaName:{
        type:String
    },
    buaAge:{
        type:Number
    },
    buaStatus:{
        type:Boolean,
        default:false
    }


})
const chachaSchema= new mongoose.Schema({
    chachaName:{
        type:String
    },
    chachaAge:{
        type:Number
    },
    chachaStatus:{
        type:Boolean,
        default:false
    }

})
const FatherFamilySchema = new mongoose.Schema({
    grandFather:{
        type:String
    },
    grandMother:{
        type:String
    },
    grandFatherAge:{
        type:Number
    },
    grandMotherAge:{
        type:Number
    },
    grandFatherStatus:{
        type:Boolean,
        default:false
    },
    grandMotherStatus:{
        type:Boolean,
        default:false
    },
    tau:[tauSchema],
    bua:[buaSchema],
    chacha:[chachaSchema]
})
module.exports = mongoose.model('FatherFamily',FatherFamilySchema)