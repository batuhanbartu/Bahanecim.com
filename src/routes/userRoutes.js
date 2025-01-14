const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');

// Tüm rotalar auth gerektirir
router.use(auth);

// Profil işlemleri
router.get('/profile', userController.getProfile);
router.patch('/profile', validator.validateProfileUpdate, userController.updateProfile);
router.patch('/password', validator.validatePasswordUpdate, userController.updatePassword);

module.exports = router; 