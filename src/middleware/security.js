const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

// Rate limiting
const limiter = rateLimit({
    max: 100, // 100 istek
    windowMs: 60 * 60 * 1000, // 1 saat
    message: 'Çok fazla istek gönderdiniz, lütfen bir saat sonra tekrar deneyin'
});

// Güvenlik middleware'leri
const securityMiddleware = (app) => {
    // HTTP header güvenliği
    app.use(helmet());

    // XSS koruması
    app.use(xss());

    // Rate limiting
    app.use('/api', limiter);

    // CORS ayarları
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
};

module.exports = securityMiddleware; 