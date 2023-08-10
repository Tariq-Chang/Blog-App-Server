const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    profile: {
        username: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        },
        avatar: {
            type:String,
            default: 'https://www.w3schools.com/w3images/avatar2.png'
        }
    },
    blogs: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog'
    },
    comments: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    },
    // role: {
    //     type: String,
    //     enum: ['user' | 'admin'],
    //     default: 'user'
    // }
})

const User = mongoose.model('user',userSchema);

module.exports = User;