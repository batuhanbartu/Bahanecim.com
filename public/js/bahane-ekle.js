document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const bahaneForm = document.getElementById('bahaneForm');

    // Form gönderimi
    bahaneForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            content: document.getElementById('content').value,
            category: document.getElementById('category').value
        };

        try {
            const response = await fetch('/api/bahane/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            // Response'un JSON olup olmadığını kontrol et
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Sunucudan geçersiz yanıt alındı');
            }

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                alert('Bahaneniz başarıyla eklendi!');
                bahaneForm.reset();
                // Popüler bahaneler sayfasına yönlendir
                window.location.href = '/populer.html';
            } else {
                throw new Error(data.message || 'Bahane eklenirken bir hata oluştu');
            }
        } catch (err) {
            console.error('Bahane ekleme hatası:', err);
            alert(err.message || 'Bahane eklenirken bir hata oluştu!');
        }
    });

    // Çıkış yapma işlemi
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });
}); 