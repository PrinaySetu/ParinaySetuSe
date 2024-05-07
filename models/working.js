const mongoose = require('mongoose')
const WorkingSchema = new mongoose.Schema({
    incomeSource:{
        type:String
    },
    employerName:{
        type:String
    },
    natureWork:{
        type:String
    },
    completedPeriod:{
        type:String
    },
    annualIncome:{
        type:String
    },
    otherSources:{
        type:String
    },
    financialResponsibility:{
        type:String
    },
    
    memberResponsibility:{
        type:String
    },
    
})
module.exports = mongoose.model('Working', WorkingSchema)