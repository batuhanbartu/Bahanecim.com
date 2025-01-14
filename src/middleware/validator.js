const ApiError = require('../utils/apiError');

/**
 * Request validasyonu için middleware
 */
class Validator {
    /**
     * Bahane ekleme validasyonu
     */
    validateBahane = (req, res, next) => {
        const { content, category } = req.body;

        if (!content || content.trim().length < 10) {
            throw new ApiError('Bahane en az 10 karakter olmalıdır', 400);
        }

        if (!category || !['İş', 'Okul', 'Sosyal', 'Diğer'].includes(category)) {
            throw new ApiError('Geçersiz kategori', 400);
        }

        next();
    };

    /**
     * Kullanıcı kaydı validasyonu
     */
    validateSignup = (req, res, next) => {
        const { username, email, password } = req.body;

        if (!username || username.trim().length < 3) {
            throw new ApiError('Kullanıcı adı en az 3 karakter olmalıdır', 400);
        }

        if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
            throw new ApiError('Geçerli bir e-posta adresi giriniz', 400);
        }

        if (!password || password.length < 6) {
            throw new ApiError('Şifre en az 6 karakter olmalıdır', 400);
        }

        next();
    };

    /**
     * ObjectId validasyonu
     */
    validateObjectId = (req, res, next) => {
        const id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ApiError('Geçersiz ID formatı', 400);
        }
        next();
    };

    /**
     * Profil güncelleme validasyonu
     */
    validateProfileUpdate = (req, res, next) => {
        const { username, email } = req.body;

        if (username && username.trim().length < 3) {
            throw new ApiError('Kullanıcı adı en az 3 karakter olmalıdır', 400);
        }

        if (email && !email.match(/^\S+@\S+\.\S+$/)) {
            throw new ApiError('Geçerli bir e-posta adresi giriniz', 400);
        }

        next();
    };

    /**
     * Şifre güncelleme validasyonu
     */
    validatePasswordUpdate = (req, res, next) => {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new ApiError('Mevcut şifre ve yeni şifre zorunludur', 400);
        }

        if (newPassword.length < 6) {
            throw new ApiError('Yeni şifre en az 6 karakter olmalıdır', 400);
        }

        next();
    };
}

module.exports = new Validator(); 