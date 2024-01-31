const express = require('express');
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/sendMessage/:groupId', authenticateToken, messageController.sendMessage);
router.put('/likeMessage/:messageId', authenticateToken, messageController.likeMessage);

module.exports = router;
