const mongoose = require('mongoose')
const MotherFamily = require('./MotherFamily')
const Property = require('./Property')

const ProfileSchema = new mongoose.Schema({
    fatherName:{
        type: String,
        // required: true
    },
    motherName:{
        type:String
    },
    guardianName:{
        type:String
    },
    guardianRelation:{
        type:String
    },
    birthDate:{
        type: Date,
        require:true
    },
    birthPlace:{
        type:String
    },
    birthTime:{
        type:String
    },
    gender:{
        type:String
    },
    height:{
        type:String
    },
    weight:{
        type:String
    },
    bloodGroup:{
        type:String
    },
    color:{
        type:String
    },
    feast:{
        type:String
    },
    previousDisease:{
        type:String
    },
    identityMark:{
        type:String
    },
    maritalStatus:{
        type:String,
        enum:["unmarried","divorced","widow"]
    },
    residenceType:{
        type:String,
        enum:["indian", "nri","foreigner"]
    },
    gotra:{
        type:String
    },
    gotraMama:{
        type:String
    },
    religion:{
        type:String
    },
    caste:{
        type:String
    },
    upcaste:{
        type:String
    },
    manglikStatus:{
        type:Boolean,
        default:false
    },
    recommendedProfiles:[{
        type:String
    }],
    education:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Education'
    },
    occupation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Working'
    },
    contacts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Contact'
    },
    relatives:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Relatives'
    },
    friends:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Friends'
    },
    familyDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FamilyDetails'
    },
    fatherFamily:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FatherFamily'
    },
    motherFamily:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MotherFamily'
    },
    property:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property'
    },
    documents:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Documents'
    },
    special:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Specials'
    },
    

})


module.exports =  mongoose.model('Profile', ProfileSchema)