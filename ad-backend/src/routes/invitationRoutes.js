const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, invitationController.createInvitation);
router.get('/', authenticate, invitationController.getInvitations);
router.put('/:id/respond', authenticate, invitationController.respondToInvitation);

module.exports = router;
