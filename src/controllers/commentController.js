const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');

const addComment = async (req, res) => {
    const { comment } = req.body;
    const blogId = req.params.blogId;
    try {
        const newComment = new Comment({
            comment: comment,
            user: req.user._id,
        })

        await newComment.save();

        const updatedBlogs = await Blog.findByIdAndUpdate(blogId, { $push: { comments: newComment._id } }, { new: true }).populate('comments')
        res.status(201).json({ success: "Comment added successfully", updatedBlogs })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const blogId = req.params.blogId;

    const comment = await Comment.findOne({ _id: commentId });
    console.log(comment);

    if (!comment) {
        res.status(400).json({ message: "Comment does not exist" })
    }

    // Check if the logged in user is an author of this blog and delete it
    if (comment.user.toString() !== req.user._id.toString() && !req.user.role.includes('admin')) {
        return res.status(403).json({ message: `${req.user.email} do not have permissions for this operation` })
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $pull: { comments: commentId } }, // Remove the commentId from the comments array
            { new: true }
        ).populate('comments');

        return res.status(203).json({ success: "Comment deleted successfully", deletedComment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
module.exports = { addComment, deleteComment };