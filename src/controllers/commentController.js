const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');

const addComment = async(req, res) => {
    const {comment} = req.body;
    const blogId = req.params.id;
    try {
        const newComment = new Comment({
            comment: comment,
            user: req.user._id,
        })

        await newComment.save();
        
        const updatedBlogs = await Blog.findByIdAndUpdate(blogId, {$push: {comments : newComment._id}}, {new:true}).populate('comments')
        res.status(201).json({success:"Comment added successfully", updatedBlogs})
    } catch (error) {
        res.status(500).json({error: error.message})
    }   
}

module.exports = {addComment};