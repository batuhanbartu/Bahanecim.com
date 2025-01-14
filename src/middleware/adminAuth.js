const ApiError = require('../utils/apiError');

/**
 * Admin yetkisi kontrolü için middleware
 */
const adminAuth = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError('Bu işlem için admin yetkisi gerekiyor', 403);
    }
    next();
};

module.exports = adminAuth; 