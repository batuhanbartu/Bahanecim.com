const mongoose = require('mongoose');
const Bahane = require('../src/models/Bahane');
require('dotenv').config();

const sampleBahaneler = [
    {
        content: "Evde su borusu patladı, gelemiyorum!",
        category: "İş",
        votes: 15,
        isActive: true
    },
    {
        content: "Kedim klavyenin üstüne yattı, ödevi gönderemiyorum.",
        category: "Okul",
        votes: 25,
        isActive: true
    },
    {
        content: "Telefonum şarjsız kaldı, mesajı göremedim.",
        category: "Sosyal",
        votes: 8,
        isActive: true
    },
    {
        content: "Uzaylılar arabamı kaçırdı, geç kalacağım.",
        category: "İş",
        votes: 42,
        isActive: true
    },
    {
        content: "Kuşum internet kablosunu kemirmiş.",
        category: "Okul",
        votes: 19,
        isActive: true
    },
    {
        content: "Komşunun papağanı alarm sesimi taklit ediyor, uyuyakaldım.",
        category: "İş",
        votes: 31,
        isActive: true
    },
    {
        content: "Kahve makinesi beni rehin aldı, çıkamıyorum.",
        category: "Sosyal",
        votes: 27,
        isActive: true
    },
    {
        content: "Zaman yolculuğu yaptım, yanlış güne geldim.",
        category: "Diğer",
        votes: 50,
        isActive: true
    }
];

const addSamples = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Önce admin kullanıcısını bul
        const User = require('../src/models/User');
        const admin = await User.findOne({ role: 'admin' });
        
        if (!admin) {
            console.error('Önce admin kullanıcısı oluşturun!');
            process.exit(1);
        }

        // Bahanelere admin yazarını ekle
        const bahanelerWithAuthor = sampleBahaneler.map(b => ({
            ...b,
            author: admin._id
        }));

        await Bahane.insertMany(bahanelerWithAuthor);
        console.log('Örnek bahaneler eklendi!');
        process.exit(0);
    } catch (err) {
        console.error('Hata:', err);
        process.exit(1);
    }
};

addSamples(); 