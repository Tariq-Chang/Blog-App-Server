const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register',upload.single('profile'), authController.register);

module.exports = router;