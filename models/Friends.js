const mongoose = require('mongoose')

const FriendsSchema = new mongoose.Schema({
    firstFriendName:{
        type:String
    },
    firstFriendRelation:{
        type:String
    },
    firstFriendContact:{
        type:Number
    },
    firstFriendAddress:{
        type:String
    },
    
    secondFriendName:{
        type: String,
    },  
    secondFriendRelation:{
        type:String
    },
    secondFriendContact:{
        type:Number
    },
    secondFriendAddress:{
        type:String
    },
})
module.exports = mongoose.model('Friends', FriendsSchema)