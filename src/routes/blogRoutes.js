const express = require('express');
const Blog = require('../models/blogSchema');
const { isAuthorizedUser } = require('../middleware/auth');
const {deleteBlog, createBlog, getUserBlogs, updateBlog } = require('../controllers/blogController');
const { addComment } = require('../controllers/commentController');

const router = express.Router();

router.get('/', getUserBlogs);
router.post('/create', createBlog);
router.delete('/delete/:id', isAuthorizedUser(['admin', 'author']), deleteBlog)
router.put('/update/:id', isAuthorizedUser(['admin', 'author']), updateBlog)
router.post('/comment/:id', addComment);

module.exports = router;