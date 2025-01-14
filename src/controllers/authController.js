const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * JWT token oluştur
 */
const createToken = (id) => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

class AuthController {
    /**
     * Kullanıcı kaydı
     */
    register = catchAsync(async (req, res) => {
        const { username, email, password } = req.body;

        // E-posta kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError('Bu e-posta adresi zaten kullanımda', 400);
        }

        // Kullanıcı oluştur
        const user = await User.create({
            username,
            email,
            password
        });

        // Token oluştur
        const token = createToken(user._id);

        // Şifreyi response'dan çıkar
        user.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: { user }
        });
    });

    /**
     * Kullanıcı girişi
     */
    login = catchAsync(async (req, res) => {
        const { email, password } = req.body;

        // E-posta ve şifre kontrolü
        if (!email || !password) {
            throw new ApiError('Lütfen e-posta ve şifrenizi girin', 400);
        }

        // Kullanıcıyı bul ve şifreyi kontrol et
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.checkPassword(password))) {
            throw new ApiError('Hatalı e-posta veya şifre', 401);
        }

        // Kullanıcı aktif mi kontrol et
        if (!user.isActive) {
            throw new ApiError('Hesabınız pasif durumda', 401);
        }

        // Son giriş tarihini güncelle
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Token oluştur
        const token = createToken(user._id);

        // Şifreyi response'dan çıkar
        user.password = undefined;

        res.json({
            status: 'success',
            token,
            data: { user }
        });
    });
}

module.exports = new AuthController(); 