const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
