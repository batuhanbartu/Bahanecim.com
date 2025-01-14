const User = require('../models/User');
const Bahane = require('../models/Bahane');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

class AdminController {
    /**
     * Tüm kullanıcıları getir
     */
    getAllUsers = catchAsync(async (req, res) => {
        const users = await User.find()
            .select('-password')
            .sort('-_id');

        res.json({
            status: 'success',
            results: users.length,
            data: users
        });
    });

    /**
     * Kullanıcı durumunu değiştir (aktif/pasif)
     */
    toggleUserStatus = catchAsync(async (req, res) => {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            throw new ApiError('Kullanıcı bulunamadı', 404);
        }

        // Admin kullanıcıları pasif yapılamaz
        if (user.role === 'admin') {
            throw new ApiError('Admin kullanıcıları pasif yapılamaz', 400);
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            status: 'success',
            data: { user }
        });
    });

    /**
     * Tüm bahaneleri getir
     */
    getAllBahaneler = catchAsync(async (req, res) => {
        const bahaneler = await Bahane.find()
            .populate('author', 'username')
            .sort('-dateAdded');

        res.json({
            status: 'success',
            results: bahaneler.length,
            data: bahaneler
        });
    });
}

module.exports = new AdminController(); 