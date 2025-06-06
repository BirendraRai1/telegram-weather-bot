const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  chatId:{
        type:Number,
        required:true,
        unique:true
    },
    userName:String,
    firstName:String,
    lastName:String,
    city:String,
    isSubscribed:{type:Boolean, default:false},
    isAdmin:{type:Boolean, default:false},
    isBlocked: { type: Boolean, default: false },
},{timestamps:true});

// Use existing connection if available
module.exports = mongoose.models.User || mongoose.model('User', userSchema);