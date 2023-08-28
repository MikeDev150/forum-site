const mongoose = require('mongoose');

const post = new mongoose.Schema({
    created_by:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    topic:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    title:{
        required:true,
        type:String,
    },
    description:{
        required:true,
        type:String,
    },
    comments:{
        required:false,
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
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

var Post = mongoose.model('Post', post);

module.exports = Post;