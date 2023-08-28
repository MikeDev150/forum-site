const mongoose = require('mongoose');

const comment = new mongoose.Schema({
    created_by:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    created_by_name:{
        required:true,
        type:String,
    },
    postid:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    comment:{
        required:true,
        type:String,
    },
    parent:{
        required:false,
        type:mongoose.Schema.Types.ObjectId,
        default:null,
    },
    parent_name:{
        required:false,
        type:String,
        default:null,
    },
    children:{
        required:false,
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    },
    hidden:{
        required:false,
        type:Boolean,
        default:false,
    },
    likes:{
        required:false,
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    },
    dislikes:{
        required:false,
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    }
});

var Comment = mongoose.model('Comment', comment);

module.exports = Comment;