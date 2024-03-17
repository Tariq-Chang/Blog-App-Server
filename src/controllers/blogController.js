const cloudinary = require("../config/cloudinary");
const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const fs = require('fs');
// *************************** GET ALL USER BLOGS ********************************************
const getUserBlogs = async (req, res) => {
  try {
    // get all blogs for perticular user
    const blogs = await Blog.find({ author: req.user._id }).populate("comments");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// *************************** GET ALL BLOGS ********************************************
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("comments");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// *************************** GET BLOG ********************************************
const getBlog = async (req, res) => {
  const blogId = req.params.blogId;
  try {
    const blog = await Blog.findOne({ _id: blogId }).populate("comments");
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// *************************** CREATE BLOG **********************************************
const createBlog = async (req, res) => {
  const { title, content, thumbnail } = req.body;
  if (!(title && content)) {
    return res.status(404).json({ message: "All fields are required" });
  }

  try {
    const blog = new Blog({
      title,
      content,
      thumbnail,
      author: req.user._id,
    });

    await blog.save();

    const user = req.user;

    if (user.role.includes("admin") && user.role.length < 2) {
      // set user role to admin and author
      await User.updateOne({ _id: user._id }, { $push: { role: "author" } });
    } else if (user.role.includes("user")) {
      // set user role to author
      await User.updateOne({ _id: user._id }, { $set: { role: "author" } });
    }

    res.status(201).json({ success: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// **************************** DELETE BLOG *******************************************
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return res.status(400).json({ message: "Blog does not exist" });
    }

    // Check if the logged in user is an author of this blog and delete it
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.role.includes("admin")
    ) {
      return res
        .status(403)
        .json({
          message: `${req.user.email} do not have permissions for this operation`,
        });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    return res
      .status(203)
      .json({ success: "Blog deleted successfully", deletedBlog });
  } catch (error) {
    res.status(500).json({ message: "Could not delete blog" });
  }
};

// ********************************** UPDATE BLOG ****************************************
const updateBlog = async (req, res) => {
  const { title, content, thumbnail } = req.body;
  const { id } = req.params;
  try {
    const blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return res.status(400).json({ message: "Blog does not exist" });
    }
    // Check if the logged in user is an author of this blog and delete it
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.role.includes("admin")
    ) {
      return res
        .status(403)
        .json({
          message: `${req.user.email} do not have permissions for this operation`,
        });
    }

    let newBlog = {
      title,
      content,
      thumbnail: thumbnail && thumbnail,
    };

    await Blog.findByIdAndUpdate(id, newBlog, { new: true });
    res.status(200).json({ success: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **************************** SEARCH BLOG ******************************************
const searchBlogByTitle = async (req, res) => {
  const title = req.query.title;
  try {
    const blogs = await Blog.find({ title: { $regex: title, $options: "i" } });
    if (!blogs) {
      res.status(400).json({ message: "Blogs do not exist" });
    }

    res.status(200).json({ result: blogs });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

// **************************** UPLOAD PROFILE PHOTO *********************************
const uploadProfilePicture = async (req, res) => {

  try {
    if (!req.file.path) return res.status(400).json({ message: "File not selected" });

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "images"
    });

    // Update the user's profile avatar field with the Cloudinary URL
    await User.findByIdAndUpdate(req.user._id, { "profile.avatar": response.url + `?${Date.now()}` });

    // Delete local file on the server
    fs.unlinkSync(req.file.path);

    // file uploaded successfully
    return res.status(200).json({ message: "profile image uploaded successfully", img_url: response.url })
  } catch (error) {
    // delete local file on the server
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: "File deleted from the server" })
  }
};

// **************************** UPDATE PROFILE INFO *********************************
const updateUserInfo = async (req, res) => {
  const { username, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { "username": username, "profile.bio": bio }, { new: true });
    res.status(200).json({ success: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// **************************** UPDATE PROFILE INFO *********************************
const addBlogThumbnail = async (req, res) => {
  try {

    if (!req.file.path) return res.status(400).json({ message: "File not selected" });

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "thumbnails"
    });

    // Update the user's profile avatar field with the Cloudinary URL
    await Blog.findByIdAndUpdate(req.user._id, { "thumbnail": response.url + `?${Date.now()}` });

    // Delete local file on the server
    fs.unlinkSync(req.file.path);

    // file uploaded successfully
    return res.status(200).json({ message: "thumbnail image uploaded successfully", img_url: response.url })
  } catch (error) {
    // delete local file on the server
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: "File deleted from the server" })
  }
}

// **************************** UPLOAD HELPER FUNCTION *********************************
const uploadCloudinaryImages = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "BlogImages"
      });
      resolve(response.secure_url);
    } catch (error) {
      reject(error);
    }
  })
}

// **************************** ADD BLOG IMAGES *********************************
const addBlogImages = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return res.status(404).json("Blog not found");
    }

    // Check if the logged in user is an author of this blog and delete it
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.role.includes("admin")
    ) {
      return res
        .status(403)
        .json({
          message: `${req.user.email} do not have permissions for this operation`,
        });
    }

    if (req.files.length < 0) return res.status(400).json({ message: "File not selected" });
    const files = req.files;
    const imageUrls = []

    for (const file of files) {
      // upload images to cloudinary one by one
      const imageUrl = await uploadCloudinaryImages(file)
      imageUrls.push(imageUrl);
      try {
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, { $push: { "images": imageUrl + `?${Date.now()}` } });
      } catch (error) {
        // delete local file on the server
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "File deleted from the server" })
      }
      // Delete local file on the server
      fs.unlinkSync(file.path);
    }
    // file uploaded successfully
    return res.status(200).json({ message: "image(s) uploaded successfully", img_urls: imageUrls })
  } catch (error) {
    return res.status(500).json(error);
  }
}

// **************************** SAVE BLOG *********************************
const saveBlog = async (req, res) => {
  const blogId = req.body.blogId;
  try {
    // getting savedBlogs for a logged in user
    const result = await User.find({ _id: req.user._id }, { savedBlogs: 1 });
    const savedBlogs = result[0].savedBlogs;

    // check if blog already saved
    const isAlreadyExist = savedBlogs?.find((savedBlog) => (savedBlog.toString() === blogId))
    if (isAlreadyExist) {
      return res.status(400).json({ message: "Blog already saved" })
    }

    // check blog does not exist with this id
    const blog = await Blog.findOne({ _id: blogId });

    if (!blog) {
      return res.status(404).json("blog does not exist");
    }

    // update the user savedBlogs field by pushing blogId to savedBlogs
    await User.findByIdAndUpdate({ _id: req.user._id }, { $push: { 'savedBlogs': blog._id } })

    // get updated blogs from user and populate those id's
    const updatedSavedBlogs = await User.findById({ _id: req.user._id }, { savedBlogs: 1 }).populate('savedBlogs');
    res.status(200).json({ message: "Blog saved successfully", savedBlogs: updatedSavedBlogs });

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const removeSavedBlog = async (req, res) => {
  const { id } = req.params;
  try {
    // getting savedBlogs for a logged in user
    const result = await User.find({ _id: req.user._id }, { savedBlogs: 1 });
    const savedBlogs = result[0].savedBlogs;

    // no blogs is saved
    if (savedBlogs.length < 0) res.status(404).json({ message: "No saved blogs found" })

    // filter to delete blog id we want to remove
    const updatedBlogsIds = await savedBlogs.filter((savedBlogId) => savedBlogId.toString() !== id)

    // same length when blog does not exist with that id
    if (updatedBlogsIds.length === savedBlogs.length) {
      return res.status(404).json({ message: "Saved blog does not exist" })
    }

    // update savedBlogs field to filteredId's for logged in user
    await User.updateOne({ _id: req.user._id }, { $set: { savedBlogs: updatedBlogsIds } })

    // get updated blogs from user and populate those id's
    const updatedSavedBlogs = await User.findById({ _id: req.user._id }, { savedBlogs: 1 }).populate('savedBlogs');
    res.status(203).json({ message: "Removed from saved blogs", savedBlogs: updatedSavedBlogs });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const incrementLikes = async (req, res) => {
  const blogId = req.params.blogId;

  if (!blogId) {
    return res.status(404).message("Blog does not exist");
  }

  try {
    const {likedBlogs} = await User.findOne(req.user._id, {likedBlogs: 1});

    // Get blog by ID
    const blog = await Blog.findOne({_id: blogId});

    // Check if blog is already liked
    if(likedBlogs.includes(blog._id)){
      return res.status(400).json({message: "Blog already liked"});
    }
    // Update like count
    await Blog.findByIdAndUpdate(blogId, { $inc: { like: 1} });

    // update user likedBlogs array
    await User.findByIdAndUpdate({_id:req.user._id}, {$push: {likedBlogs: blog._id} })
    const updatedUser = await User.findOne({_id: req.user._id})
    console.log("updatedUser", updatedUser);
    // find blog which was update again return only like field
    const likes = await Blog.findOne({_id:blogId}, {like: 1})
    res.status(200).json({ likes, updatedUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const decrementLikes = async (req, res) => {
  const blogId = req.params.blogId;

  if (!blogId) {
    return res.status(404).message("Blog does not exist");
  }

  try {
    const {likedBlogs} = await User.findOne(req.user._id, {likedBlogs: 1});

    // Get blog by ID
    const blog = await Blog.findOne({_id: blogId});

    // Check if blog is liked
    if(!likedBlogs.includes(blog._id)){
      return res.status(400).json({message: "Blog is not liked"});
    }

    // Update like count
    await Blog.findByIdAndUpdate(blogId, { $inc: { like: -1} });

    // update user likedBlogs array
    await User.findByIdAndUpdate(req.user._id, {$pull: {likedBlogs: blog._id} })
    const updatedUser = await User.findOne({_id: req.user._id});
    // find blog which was update again return only like field
    const likes = await Blog.findOne({_id:blogId}, {like: 1})
    res.status(200).json({ likes: likes, updatedUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
  getUserBlogs,
  getBlog,
  createBlog,
  deleteBlog,
  updateBlog,
  incrementLikes,
  decrementLikes,
  searchBlogByTitle,
  uploadProfilePicture,
  getAllBlogs,
  addBlogThumbnail,
  updateUserInfo,
  addBlogImages,
  saveBlog,
  removeSavedBlog
};
