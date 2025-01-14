// Bu dosya login.js ve register.js'in ortak fonksiyonlarını içerecek
const handleAuthResponse = (data) => {
    if (data.status === 'success') {
        // Token ve kullanıcı bilgilerini kaydet
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Admin ise admin paneline, değilse ana sayfaya yönlendir
        if (data.data.user.role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/';
        }
    } else {
        throw new Error(data.message || 'İşlem başarısız!');
    }
};

const handleAuthError = (err) => {
    console.error('Hata:', err);
    alert(err.message || 'Bir hata oluştu!');
};

module.exports = {
    handleAuthResponse,
    handleAuthError
}; 