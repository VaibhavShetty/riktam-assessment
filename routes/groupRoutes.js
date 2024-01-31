const express = require('express');
const groupController = require('../controllers/groupController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/createGroup', authenticateToken, groupController.createGroup);
router.delete('/deleteGroup/:groupId', authenticateToken, groupController.deleteGroup);
router.get('/searchGroup/:groupName', authenticateToken, groupController.searchGroup);
router.post('/addMember/:groupId/:userId', authenticateToken, groupController.addMember);

module.exports = router;
