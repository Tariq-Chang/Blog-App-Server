const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog'
    }
}, {timestamps: true})

const Comment = mongoose.model('comment',commentSchema)
module.exports = Comment;