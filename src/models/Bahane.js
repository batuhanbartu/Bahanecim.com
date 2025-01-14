const mongoose = require('mongoose');

const bahaneSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Bahane içeriği zorunludur'],
        trim: true,
        minlength: [10, 'Bahane en az 10 karakter olmalıdır'],
        maxlength: [200, 'Bahane en fazla 200 karakter olabilir']
    },
    category: {
        type: String,
        required: [true, 'Kategori seçimi zorunludur'],
        enum: ['İş', 'Okul', 'Sosyal', 'Diğer']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    voters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

// Popüler bahaneleri getir
bahaneSchema.statics.getPopular = function() {
    return this.find({ isActive: true })
        .sort({ votes: -1 })
        .limit(10)
        .populate('author', 'username');
};

// Rastgele bahane getir
bahaneSchema.statics.getRandom = function(category) {
    let query = { isActive: true };
    if (category) {
        query.category = category;
    }
    return this.aggregate([
        { $match: query },
        { $sample: { size: 1 } }
    ]);
};

module.exports = mongoose.model('Bahane', bahaneSchema); 