const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// JWT token oluşturma
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Kayıt olma
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const user = await User.create({
            username,
            email,
            password
        });

        const token = createToken(user._id);

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// Giriş yapma
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Lütfen email ve şifrenizi giriniz'
            });
        }

        // Kullanıcıyı bul
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Email veya şifre hatalı'
            });
        }

        const token = createToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = router; 