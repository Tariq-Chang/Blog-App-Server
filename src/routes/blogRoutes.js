const express = require('express');
const Blog = require('../models/blogSchema');
const { isAuthorizedUser } = require('../middleware/auth');
const {deleteBlog, createBlog, getUserBlogs, updateBlog, searchBlogByTitle, uploadProfilePicture } = require('../controllers/blogController');
const { addComment, deleteComment, updateComment } = require('../controllers/commentController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getUserBlogs);
router.post('/create',upload.single('profile'), createBlog);
router.delete('/delete/:id', isAuthorizedUser(['admin', 'author']), deleteBlog)
router.put('/update/:id', isAuthorizedUser(['admin', 'author']), updateBlog)
router.post('/:blogId/comment/add', addComment);
router.delete('/:blogId/comment/delete/:commentId',isAuthorizedUser(['admin', 'author']), deleteComment);
router.put('/comment/update/:commentId',isAuthorizedUser(['admin', 'author']), updateComment);
router.get('/search', searchBlogByTitle)
router.post('/upload/profile', uploadProfilePicture);

module.exports = router;