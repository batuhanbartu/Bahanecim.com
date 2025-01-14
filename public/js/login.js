document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü - Eğer zaten giriş yapmışsa ana sayfaya yönlendir
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/';
        return;
    }

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

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
                alert(data.message || 'Giriş başarısız!');
            }
        } catch (err) {
            console.error('Giriş hatası:', err);
            alert('Giriş yapılırken bir hata oluştu!');
        }
    });
}); 