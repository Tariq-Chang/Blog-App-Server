const express = require('express');
const { isAuthorizedUser } = require('../middleware/auth');
const {deleteBlog, createBlog, getUserBlogs, updateBlog, searchBlogByTitle, getAllBlogs, updateUserInfo, addBlogThumbnail, addBlogImages, saveBlog, getSavedBlogs, removeSavedBlog, getBlog, incrementLikes, decrementLikes } = require('../controllers/blogController');
const { addComment, deleteComment, updateComment, getComments, getComment } = require('../controllers/commentController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/myBlogs', getUserBlogs);
router.post('/create',upload.single('profile'), createBlog);
router.delete('/delete/:id', isAuthorizedUser(['admin', 'author']), deleteBlog)
router.put('/update/:id', isAuthorizedUser(['admin', 'author']), updateBlog)
router.get('/:blogId([0-9a-fA-F]{24})', getBlog)
router.get('/search/', searchBlogByTitle)
router.put('/updateUserInfo',updateUserInfo);
router.post('/addBlogThumbnail',isAuthorizedUser(['admin', 'author']), upload.single('thumbnail'), addBlogThumbnail);
router.post('/addBlogImages/:id',isAuthorizedUser(['admin', 'author']), upload.array('blogImages', 3), addBlogImages);
router.put('/saveBlog', saveBlog);
router.delete('/removeSavedBlog/:id', removeSavedBlog);
router.patch('/:blogId/incrementLikes', incrementLikes);
router.patch('/:blogId/decrementLikes', decrementLikes);
router.get('/:blogId/comments/', getComments);
router.get('/comments/:commentId',getComment);
router.post('/:blogId/comment/add', addComment);
router.delete('/:blogId/comment/:commentId/delete',isAuthorizedUser(['admin', 'author']), deleteComment);
router.put('/comment/:commentId/update',isAuthorizedUser(['admin', 'author']), updateComment);

module.exports = router;