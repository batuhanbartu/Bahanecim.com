const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

class UserController {
    /**
     * Kullanıcı profilini getir
     */
    getProfile = catchAsync(async (req, res) => {
        const user = await User.findById(req.user._id).select('-password');

        res.json({
            status: 'success',
            data: { user }
        });
    });

    /**
     * Profil bilgilerini güncelle
     */
    updateProfile = catchAsync(async (req, res) => {
        const { username, email } = req.body;

        // E-posta kontrolü
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ApiError('Bu e-posta adresi zaten kullanımda', 400);
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            status: 'success',
            data: { user }
        });
    });

    /**
     * Şifre güncelle
     */
    updatePassword = catchAsync(async (req, res) => {
        const { currentPassword, newPassword } = req.body;

        // Kullanıcıyı şifresiyle birlikte al
        const user = await User.findById(req.user._id).select('+password');

        // Mevcut şifreyi kontrol et
        if (!(await user.checkPassword(currentPassword))) {
            throw new ApiError('Mevcut şifreniz hatalı', 401);
        }

        // Yeni şifreyi kaydet
        user.password = newPassword;
        await user.save();

        res.json({
            status: 'success',
            message: 'Şifreniz başarıyla güncellendi'
        });
    });
}

module.exports = new UserController(); 