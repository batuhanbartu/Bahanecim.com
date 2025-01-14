const ApiError = require('../utils/apiError');
const config = require('../config/config');

/**
 * Global hata yakalama middleware'i
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development ortamında detaylı hata
    if (config.app.nodeEnv === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    // Production ortamında basit hata
    else {
        // Operasyonel hatalar
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } 
        // Programlama hataları
        else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Bir şeyler ters gitti!'
            });
        }
    }
};

module.exports = errorHandler; 