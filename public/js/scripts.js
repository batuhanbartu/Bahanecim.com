document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Kullanıcı bilgilerini göster
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const userInfo = document.createElement('span');
        userInfo.className = 'user-info';
        userInfo.textContent = `Merhaba, ${user.username}`;
        document.querySelector('nav').insertBefore(userInfo, document.querySelector('.logout-btn'));
    }

    // DOM elementleri
    const uretButton = document.getElementById('uretButton');
    const bahaneKutusu = document.getElementById('bahaneKutusu');
    const bahaneMetni = document.getElementById('bahaneMetni');
    const kategoriSpan = document.querySelector('.kategori');
    const kategoriFilter = document.getElementById('kategoriFilter');

    // Rastgele bahane üretme
    uretButton.addEventListener('click', async () => {
        try {
            const kategori = kategoriFilter.value;
            const url = kategori ? `/api/bahane/random?kategori=${kategori}` : '/api/bahane/random';
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            bahaneKutusu.classList.remove('hidden');
            bahaneMetni.textContent = data.data.content;
            kategoriSpan.textContent = data.data.category;
        } catch (err) {
            console.error('Bahane üretme hatası:', err);
            alert('Bahane üretilirken bir hata oluştu!');
        }
    });

    // Paylaşma fonksiyonları
    window.paylas = (platform) => {
        const bahane = bahaneMetni.textContent;
        const text = `${bahane} via @Bahanecim`;

        let url;
        switch(platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                url = `whatsapp://send?text=${encodeURIComponent(text)}`;
                break;
        }

        if (url) {
            window.open(url, '_blank');
        }
    };

    // Kopyalama fonksiyonu
    window.kopyala = () => {
        const bahane = bahaneMetni.textContent;
        navigator.clipboard.writeText(bahane)
            .then(() => alert('Bahane panoya kopyalandı!'))
            .catch(err => console.error('Kopyalama hatası:', err));
    };

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
}); 