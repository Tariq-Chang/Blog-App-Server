const express = require('express');
const { uploadProfilePicture } = require('../controllers/blogController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload',upload.single('profile'), uploadProfilePicture);

module.exports = router;