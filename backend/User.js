const mongoose = require('mongoose');

const user = new mongoose.Schema({
    provider: {
        required:true,
        type:String,
    },
    providerID:{
        required:true,
        type:String,
    },
    username: {
        required: true,
        type: String
    },
    email: {
        required:true,
        type:String
    },
    role: {
        required:true,
        type:String,
        default: 'user',
    }
});

var User = mongoose.model('User', user);

module.exports = User;
