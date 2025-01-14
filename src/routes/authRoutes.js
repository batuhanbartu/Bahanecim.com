const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validator = require('../middleware/validator');

// Kayıt ve giriş rotaları
router.post('/register', validator.validateSignup, authController.register);
router.post('/login', authController.login);

module.exports = router; 