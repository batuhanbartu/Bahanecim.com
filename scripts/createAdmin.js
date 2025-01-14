const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
require('dotenv').config();

// Güvenlik kontrolü - özel bir environment variable ile kontrol
if (!process.env.ADMIN_SECRET || process.env.ADMIN_SECRET !== 'gizli_token_123') {
    console.error('Yetkisiz erişim!');
    process.exit(1);
}

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Önce mevcut admin kontrolü
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.error('Sistemde zaten bir admin kullanıcısı mevcut!');
            process.exit(1);
        }

        // Rastgele şifre oluştur
        const randomPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        await User.create({
            username: 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@bahanecim.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        console.log('Admin kullanıcısı oluşturuldu!');
        console.log('Email:', process.env.ADMIN_EMAIL || 'admin@bahanecim.com');
        console.log('Şifre:', randomPassword);
        console.log('Bu bilgileri güvenli bir yerde saklayın!');
        process.exit(0);
    } catch (err) {
        console.error('Hata:', err);
        process.exit(1);
    }
};

createAdmin(); 