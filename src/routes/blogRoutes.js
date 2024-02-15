const express = require('express');
const { isAuthorizedUser } = require('../middleware/auth');
const {deleteBlog, createBlog, getUserBlogs, updateBlog, searchBlogByTitle, getAllBlogs, updateUserInfo, addBlogThumbnail, addBlogImages } = require('../controllers/blogController');
const { addComment, deleteComment, updateComment } = require('../controllers/commentController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/myBlogs', getUserBlogs);
router.post('/create',upload.single('profile'), createBlog);
router.delete('/delete/:id', isAuthorizedUser(['admin', 'author']), deleteBlog)
router.put('/update/:id', isAuthorizedUser(['admin', 'author']), updateBlog)
router.post('/:blogId/comment/add', addComment);
router.delete('/:blogId/comment/:commentId/delete',isAuthorizedUser(['admin', 'author']), deleteComment);
router.put('/comment/:commentId/update',isAuthorizedUser(['admin', 'author']), updateComment);
router.get('/search', searchBlogByTitle)
router.put('/updateUserInfo',updateUserInfo);
router.post('/addBlogThumbnail',isAuthorizedUser(['admin', 'author']), upload.single('thumbnail'), addBlogThumbnail);
router.post('/addBlogImages/:id',isAuthorizedUser(['admin', 'author']), upload.array('blogImages', 3), addBlogImages);

module.exports = router;