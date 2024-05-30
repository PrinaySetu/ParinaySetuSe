const mongoose = require('mongoose')
const Profile = require('./Profile')
const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    userType:{
        type: String,
        required: true,
        enum:["admin", "user"]

    },
    image: {
        type: String,
      },
    token:{
        type: String
    },
    resetPasswordExpires: {
        type: Date,
      },
      additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'Profile'
      }


})
module.exports = mongoose.model('User', UserSchema)