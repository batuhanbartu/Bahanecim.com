document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // DOM elementleri
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');

    // Profil bilgilerini yükle
    async function loadProfile() {
        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.status === 'success') {
                document.getElementById('username').value = data.data.user.username;
                document.getElementById('email').value = data.data.user.email;
            }
        } catch (err) {
            console.error('Profil yükleme hatası:', err);
        }
    }

    // Profil güncelleme
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value
        };

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Profil bilgileriniz güncellendi!');
                // Kullanıcı bilgilerini localStorage'da güncelle
                const user = JSON.parse(localStorage.getItem('user'));
                user.username = formData.username;
                user.email = formData.email;
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                alert(data.message || 'Güncelleme başarısız!');
            }
        } catch (err) {
            console.error('Profil güncelleme hatası:', err);
            alert('Güncelleme sırasında bir hata oluştu!');
        }
    });

    // Şifre değiştirme
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            currentPassword: document.getElementById('currentPassword').value,
            newPassword: document.getElementById('newPassword').value
        };

        try {
            const response = await fetch('/api/user/password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Şifreniz başarıyla güncellendi!');
                passwordForm.reset();
            } else {
                alert(data.message || 'Şifre güncelleme başarısız!');
            }
        } catch (err) {
            console.error('Şifre güncelleme hatası:', err);
            alert('Şifre güncellenirken bir hata oluştu!');
        }
    });

    // Çıkış yapma işlemi
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    }

    // Sayfa yüklendiğinde profil bilgilerini getir
    loadProfile();
}); 