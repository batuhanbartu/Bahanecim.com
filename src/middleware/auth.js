const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const config = require('../config/config');
const catchAsync = require('../utils/catchAsync');

/**
 * Kimlik doğrulama middleware'i
 */
const auth = catchAsync(async (req, res, next) => {
    // Token'ı al
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError('Lütfen giriş yapın', 401);
    }

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, config.jwt.secret);

        // Kullanıcıyı bul
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new ApiError('Bu token\'a sahip kullanıcı artık mevcut değil', 401);
        }

        // Kullanıcı aktif mi kontrol et
        if (!user.isActive) {
            throw new ApiError('Hesabınız pasif durumda', 401);
        }

        // Kullanıcıyı request'e ekle
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            throw new ApiError('Geçersiz token', 401);
        }
        if (err.name === 'TokenExpiredError') {
            throw new ApiError('Token süresi dolmuş', 401);
        }
        throw err;
    }
});

module.exports = auth; 