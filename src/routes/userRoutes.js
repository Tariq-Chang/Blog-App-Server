const express = require('express');
const { getUserById, getAllUsers, getLikedBlogs } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/getLikedBlogs', getLikedBlogs);

module.exports = router;