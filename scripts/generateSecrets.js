const crypto = require('crypto');

// 64 karakterlik güvenli rastgele string oluştur
const generateSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

console.log('\nGüvenli tokenlarınız oluşturuldu:\n');
console.log('JWT_SECRET=' + generateSecret());
console.log('ADMIN_SECRET=' + generateSecret());
console.log('\nBu değerleri .env dosyanıza kopyalayın!\n'); 