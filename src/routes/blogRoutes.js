const express = require('express');
const Blog = require('../models/blogSchema');
const { isAuthorizedUser } = require('../middleware/auth');
const {deleteBlog, createBlog, getUserBlogs } = require('../controllers/blogController');

const router = express.Router();

router.get('/', getUserBlogs);
router.post('/create', createBlog);
router.delete('/delete/:id', isAuthorizedUser(['admin', 'author']), deleteBlog)

module.exports = router;