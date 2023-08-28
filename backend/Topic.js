const mongoose = require('mongoose');

const topic = new mongoose.Schema({
    created_by:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    lower_title:{
        required:true,
        type:String,
        unique:true,
    },
    title:{
        required:true,
        type:String,
    },
    description:{
        required:false,
        type:String,
        default:"",
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
    },
    posts:{
        required:false,
        type:[mongoose.Schema.Types.ObjectId],
        default:[],
    }
});

var Topic = mongoose.model('Topic', topic);

module.exports = Topic;
