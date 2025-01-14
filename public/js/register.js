document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü - Eğer zaten giriş yapmışsa ana sayfaya yönlendir
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/';
        return;
    }

    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        if (password !== passwordConfirm) {
            alert('Şifreler eşleşmiyor!');
            return;
        }

        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: password
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                window.location.href = '/login.html';
            } else {
                alert(data.message || 'Kayıt başarısız!');
            }
        } catch (err) {
            console.error('Kayıt hatası:', err);
            alert('Kayıt olurken bir hata oluştu!');
        }
    });

    // Şifre kontrolü
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');

    function checkPasswords() {
        if (passwordConfirmInput.value && passwordInput.value !== passwordConfirmInput.value) {
            passwordConfirmInput.setCustomValidity('Şifreler eşleşmiyor!');
        } else {
            passwordConfirmInput.setCustomValidity('');
        }
    }

    passwordInput.addEventListener('change', checkPasswords);
    passwordConfirmInput.addEventListener('keyup', checkPasswords);
}); 