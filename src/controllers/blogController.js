const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");

// *************************** GET ALL USER BLOGS ********************************************
const getUserBlogs = async (req, res) => {
    try {
        // get all blogs for perticular user
        const blogs = await Blog.find({ author: req.user.id });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// *************************** CREATE BLOG **********************************************
const createBlog = async (req, res) => {
    const { title, content } = req.body;
    if (!(title && content)) {
        return res.status(404).json({ message: "All fields are required" })
    }

    try {
        const blog = new Blog({
            title,
            content,
            author: req.user._id,
        });

        await blog.save();
        
        const user = req.user
        
        if (user.role.includes('admin') && user.role.length < 2) {
            // set user role to admin and author 
            await User.updateOne({ _id: user._id }, { $push: { role: 'author' } })

        } else if (user.role.includes('user')) {
            // set user role to author
            await User.updateOne({ _id: user._id }, { $set: { role: 'author' } })
        }


        res.status(201).json({ success: "Blog created successfully", blog })
    } catch (error) {
        res.status(500).json({ error })
    }
}

// **************************** DELETE BLOG *******************************************
const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findOne({ _id: id });

        if (!blog) {
            return res.status(400).json({ message: "Blog does not exist" });
        }

        // Check if the logged in user is an author of this blog and delete it
        if (blog.author.toString() !== req.user._id.toString() && !req.user.role.includes('admin')) {
            return res.status(403).json({ message: `${req.user.email} do not have permissions for this operation` })
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);
        return res.status(203).json({ success: "Blog deleted successfully", deletedBlog })
    } catch (error) {
        res.status(500).json({ message: "Could not delete blog" })
    }

}

// ********************************** UPDATE BLOG ****************************************
const updateBlog = async(req, res) => {
    const { title, content, thumbnail } = req.body;
    const {id} = req.params;
    try {
        const blog = await Blog.findOne({_id:id});
        
        
        if(!blog){
            return res.status(400).json({ message: "Blog does not exist" });
        }
        // Check if the logged in user is an author of this blog and delete it
        if (blog.author.toString() !== req.user._id.toString() && !req.user.role.includes('admin')) {
            return res.status(403).json({ message: `${req.user.email} do not have permissions for this operation` })
        }
        
        let newBlog = {
            title,
            content,
            thumbnail: thumbnail && thumbnail 
        }

        await Blog.findByIdAndUpdate(id, newBlog, {new:true})
        res.status(200).json({success:"Blog updated successfully"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
module.exports = { getUserBlogs, createBlog, deleteBlog, updateBlog }