// Design Routes
// API endpoints for card design CRUD operations

const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');
const authenticate = require('../middleware/auth');

// All routes require authentication
router.get('/', authenticate, designController.getDesigns);
router.get('/:id', authenticate, designController.getDesign);
router.post('/', authenticate, designController.createDesign);
router.put('/:id', authenticate, designController.updateDesign);
router.delete('/:id', authenticate, designController.deleteDesign);

module.exports = router;
