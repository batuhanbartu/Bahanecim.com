require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const path = require('path');
const xss = require('xss-clean');
const helmet = require('helmet');

// Route'lar
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bahaneRoutes = require('./routes/bahaneRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Veritabanı bağlantısı
connectDB();

// Middleware'ler
app.use(express.json());
app.use(express.static('public'));
app.use(xss());
app.use(helmet());

// API Route'ları
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bahane', bahaneRoutes);
app.use('/api/admin', adminRoutes);

// SPA için catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 