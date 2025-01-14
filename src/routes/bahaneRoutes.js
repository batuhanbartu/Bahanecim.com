const express = require('express');
const router = express.Router();
const bahaneController = require('../controllers/bahaneController');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');

/**
 * Bahane rotaları
 */

// Public rotalar
router.get('/random', bahaneController.getRandom);
router.get('/popular', bahaneController.getPopular);

// Korumalı rotalar
router.use(auth);

router.post('/add', validator.validateBahane, bahaneController.addBahane);
router.post('/:id/vote', auth, validator.validateObjectId, bahaneController.voteBahane);
router.delete('/:id', validator.validateObjectId, bahaneController.deleteBahane);

module.exports = router; 