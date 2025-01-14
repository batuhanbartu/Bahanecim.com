# 🎭 Bahanecim.com - Profesyonel Bahane Üretici

## 📖 Proje Hakkında
Bahanecim.com, kullanıcıların günlük hayatta karşılaştıkları durumlar için yaratıcı ve eğlenceli bahaneler üretebilecekleri interaktif bir web platformudur. Kullanıcılar sisteme giriş yaparak kendi bahanelerini ekleyebilir, var olan bahaneleri oylayabilir ve paylaşabilirler.

## 🚀 Özellikler
- 🎲 Rastgele bahane üretme
- 📂 Kategori bazlı bahane filtreleme
- 👥 Kullanıcı hesap sistemi
- ⭐ Bahane oylama sistemi
- 📤 Sosyal medya paylaşım entegrasyonu
- 👑 Admin paneli
- 🔒 Gelişmiş güvenlik önlemleri

## 🛠️ Kullanılan Teknolojiler

### Backend
- **Node.js** - Sunucu tarafı JavaScript runtime
- **Express.js** - Web uygulama framework'ü
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **JWT** - JSON Web Token kimlik doğrulama
- **Bcrypt** - Şifre hashleme

### Güvenlik
- **Helmet** - HTTP header güvenliği
- **XSS-Clean** - Cross-site scripting koruması
- **Express-Rate-Limit** - API rate limiting
- **CORS** - Cross-Origin Resource Sharing yapılandırması

### Frontend
- **HTML5** - Sayfa yapısı
- **CSS3** - Stil ve tasarım
- **JavaScript** - İstemci tarafı programlama


## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükleyin:

npm install


2. `.env` dosyasını oluşturun:

env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/bahane-uretici
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
NODE_ENV=development


3. Uygulamayı çalıştırın:

##Geliştirme modu
npm run dev

##Production modu
npm start


## 🔒 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Bahane Routes
- `GET /api/bahane/random` - Rastgele bahane
- `GET /api/bahane/popular` - Popüler bahaneler
- `POST /api/bahane/add` - Yeni bahane ekle
- `POST /api/bahane/:id/vote` - Bahaneye oy ver

### Admin Routes
- `GET /api/admin/users` - Kullanıcı listesi
- `GET /api/admin/bahaneler` - Bahane yönetimi
- `POST /api/admin/users/:id/toggle` - Kullanıcı durumu değiştir

## 👥 Kullanıcı Rolleri

### Normal Kullanıcı
- Bahane görüntüleme
- Bahane ekleme
- Oy verme
- Profil yönetimi

### Admin
- Kullanıcı yönetimi
- Bahane moderasyonu
- Sistem istatistikleri
- Kategori yönetimi

## 🔐 Güvenlik Özellikleri
- JWT tabanlı kimlik doğrulama
- Şifre hashleme (bcrypt)
- API rate limiting
- XSS koruması
- Güvenli HTTP headers
- Input validation

## 📝 Geliştirici Notları
- Tüm API istekleri için JWT token gereklidir
- Rate limiting: 15 dakikada maksimum 100 istek
- Şifre minimum 6 karakter olmalıdır
- Admin hesabı oluşturmak için özel token gerekir
