const mongoose = require('mongoose');
const specialSchema = new mongoose.Schema({
    qualities:{
        type:String
    },
    specificCaste:{
        type:String
    },
    likes:{
        type:String
    },
    dislikes:{
        type:String
    },
    intercaste:{
        type:String
    },
    hobbies:{
        type:String
    },
    lifeStyle:{
        type:String
    },
})
module.exports = mongoose.model('Specials', specialSchema)