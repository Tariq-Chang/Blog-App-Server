const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    }, 
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    thumbnail: {
        type: String,
        default: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    images: {
        type: [String]
    },
    tags: {
        type: [String],
    },
    like: {
        type: Number,
        default: 0
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Comment'
    },
}, {timestamps: true})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;