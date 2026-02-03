const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');

router.post('/code', authenticate, userController.generateInviteCode);
router.post('/pair', authenticate, userController.pairWithPartner);
router.post('/unpair', authenticate, userController.unpair);

module.exports = router;
