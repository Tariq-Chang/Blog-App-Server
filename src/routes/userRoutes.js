const express = require('express');
const { getUserById, getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);

module.exports = router;