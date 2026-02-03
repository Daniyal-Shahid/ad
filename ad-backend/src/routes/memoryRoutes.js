const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, memoryController.getMemories);
router.post('/', authenticate, memoryController.createMemory);
router.delete('/:id', authenticate, memoryController.deleteMemory);

module.exports = router;
