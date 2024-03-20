const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    replies: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {timestamps: true})

const Comment = mongoose.model('Comment',commentSchema)
module.exports = Comment;