const express = require('express');
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/createUser', adminController.createUser);
router.put('/editUser/:userId', authenticateToken, adminController.editUser);
router.post('/searchUser', authenticateToken, adminController.searchUser);


module.exports = router;
