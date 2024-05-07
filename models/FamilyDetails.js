const mongoose = require('mongoose')

const brotherSchema = new mongoose.Schema({
    age:{
        type:Number
    },
    health:{
        type:String
    },
    deathAge:{
        type:Number
    },
    deathYear:{
        type:Number
    },
    maritalStatus:{
        type:String
    },
    wifeName:{
        type:String
    },
  
    childrenDetails:{
        type:String
    },
    wifeFather:{
        type:String
    },
    marriedYear:{
        type:Number
    },
})
const sisterSchema = new mongoose.Schema({
    age:{
        type:Number
    },
    health:{
        type:String
    },
    deathAge:{
        type:Number
    },
    deathYear:{
        type:Number
    },
    maritalStatus:{
        type:String
    },
    husbandName:{
        type:String
    },
  
    childrenDetails:{
        type:String
    },
    husbandFather:{
        type:String
    },
    marriedYear:{
        type:Number
    },
})
const FamilyDetailsSchema = new mongoose.Schema({
    fatherAge:{
        type:Number
    },
    fatherHealth:{
        type:String
    },
    fatherDeathAge:{
        type:Number
    },
    fatherDeathYear:{
        type:Number
    },
    motherAge:{
        type:Number
    },
    motherHealth:{
        type:String
    },
    motherDeathAge:{
        type:Number
    },
    motherDeathYear:{
        type:Number
    },
    brother:[brotherSchema],
    sister:[sisterSchema],



})
module.exports =  mongoose.model('FamilyDetails', FamilyDetailsSchema)


