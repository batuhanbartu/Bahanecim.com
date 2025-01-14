const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Kullanıcı adı zorunludur'],
        trim: true,
        minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır']
    },
    email: {
        type: String,
        required: [true, 'E-posta adresi zorunludur'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Şifre zorunludur'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Şifre hashleme
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Şifre kontrolü
userSchema.methods.checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Admin kontrolü
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

module.exports = User; 