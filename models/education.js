const mongoose = require('mongoose')

const EducationSchema = new mongoose.Schema({
     secondary:{
         type: String,
        //  required: true
     },
     secondaryYear:{
            type:Date
        },
        secondaryBoard:{
            type:String
        },
        secondayMarks:{
            type:String
        },
        
        seniorSecondary:{
            type:String
        },
        seniorSecondaryYear:{
            type:Date
        },
        seniorSecondaryBoard:{
            type:String
        },
        seniorSecondaryMarks:{
            type:String
        },
        graduation:{
            type:String
        },
        
        graduationYear:{
            type:Date
        },
        universityName:{
            type : String
        } ,    
        graduationMarks:{
            type:String
        },
        postGraduation:{
            type:String
        },
        postGraduationYear:{
            type:Date
        },
        postGraduationUniversityName:{
            type:String
        },
        postGraduationMarks:{
            type:String
        },
        other:{
            type:String
        },
        diploma:{
            type:String
        },
       diplomaYear:{
           type:Date
       },
       diplomaBoard:{
           type:String
       },
       diplomaMarks:{
           type:String
       },

})
module.exports = mongoose.model('Education', EducationSchema)