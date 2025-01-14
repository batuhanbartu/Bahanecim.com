const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Bahane = require('../models/Bahane');

// Admin yetkisi kontrolü
const adminOnly = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Bu işlem için admin yetkisi gerekiyor'
        });
    }
    next();
};

// Tüm kullanıcıları getir
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select('username email isActive role')
            .sort({ createdAt: -1 });

        res.json({
            status: 'success',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Kullanıcılar getirilirken hata oluştu'
        });
    }
});

// Tüm bahaneleri getir
router.get('/bahaneler', auth, adminOnly, async (req, res) => {
    try {
        const bahaneler = await Bahane.find()
            .populate('author', 'username')
            .sort({ dateAdded: -1 });

        res.json({
            status: 'success',
            data: bahaneler
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Bahaneler getirilirken hata oluştu'
        });
    }
});

// Kullanıcı durumunu değiştir
router.post('/users/:id/toggle', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Kullanıcı bulunamadı'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            status: 'success',
            message: `Kullanıcı ${user.isActive ? 'aktif' : 'pasif'} duruma getirildi`
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'İşlem sırasında hata oluştu'
        });
    }
});

// Kullanıcı sil
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            status: 'success',
            message: 'Kullanıcı başarıyla silindi'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Kullanıcı silinirken hata oluştu'
        });
    }
});

// Bahane sil
router.delete('/bahaneler/:id', auth, adminOnly, async (req, res) => {
    try {
        const bahane = await Bahane.findByIdAndDelete(req.params.id);
        if (!bahane) {
            return res.status(404).json({
                status: 'error',
                message: 'Bahane bulunamadı'
            });
        }

        res.json({
            status: 'success',
            message: 'Bahane başarıyla silindi'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Bahane silinirken hata oluştu'
        });
    }
});

module.exports = router; 