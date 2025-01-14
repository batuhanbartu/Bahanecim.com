require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    database: {
        uri: process.env.MONGODB_URI || ''
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    }
}; 