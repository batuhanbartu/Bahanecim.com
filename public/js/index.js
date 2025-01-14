document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Gerekli elementleri seç
    const kategoriFilter = document.getElementById('kategoriFilter');
    const uretButton = document.getElementById('uretButton');
    const bahaneKutusu = document.getElementById('bahaneKutusu');
    const bahaneMetni = document.getElementById('bahaneMetni');
    const kategoriSpan = document.getElementById('kategoriSpan');

    let currentBahaneId = null; // Şu anki bahane ID'sini tutmak için

    // Bahane üretme fonksiyonu
    async function bahaneUret() {
        try {
            // Kategori parametresini URL'ye ekle
            const kategori = kategoriFilter.value;
            let url = '/api/bahane/random';
            if (kategori) {
                url += `?category=${encodeURIComponent(kategori)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.status === 'success' && data.data) {
                bahaneMetni.textContent = data.data.content;
                kategoriSpan.textContent = data.data.category;
                currentBahaneId = data.data._id; // Bahane ID'sini kaydet
                document.getElementById('oyCount').textContent = data.data.votes;
                bahaneKutusu.classList.remove('hidden');
                
                // Oy verme butonunu aktif et
                const oyVerBtn = document.getElementById('oyVerBtn');
                oyVerBtn.disabled = false;
                if (data.data.hasVoted) {
                    oyVerBtn.classList.add('voted');
                } else {
                    oyVerBtn.classList.remove('voted');
                }
            } else {
                if (kategori) {
                    alert(`${kategori} kategorisinde bahane bulunamadı!`);
                } else {
                    alert('Bahane üretilirken bir hata oluştu!');
                }
                bahaneKutusu.classList.add('hidden');
            }
        } catch (err) {
            console.error('Bahane üretme hatası:', err);
            alert('Bahane üretilirken bir hata oluştu!');
            bahaneKutusu.classList.add('hidden');
        }
    }

    // Bahane üret butonuna tıklanınca
    uretButton.addEventListener('click', bahaneUret);

    // Kategori değiştiğinde otomatik bahane üret
    kategoriFilter.addEventListener('change', bahaneUret);

    // Kopyalama fonksiyonu
    window.kopyala = () => {
        navigator.clipboard.writeText(bahaneMetni.textContent)
            .then(() => alert('Bahane kopyalandı! 📋'))
            .catch(err => console.error('Kopyalama hatası:', err));
    };

    // Paylaşma fonksiyonu
    window.paylas = (platform) => {
        const bahane = bahaneMetni.textContent;
        const encodedBahane = encodeURIComponent(bahane);

        let url;
        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedBahane}`;
                break;
            case 'whatsapp':
                url = `whatsapp://send?text=${encodedBahane}`;
                break;
            default:
                return;
        }

        window.open(url, '_blank');
    };

    // Çıkış yapma işlemi
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Oy verme fonksiyonu
    window.oyVer = async () => {
        if (!currentBahaneId) {
            alert('Oy vermek için önce bir bahane üretmelisiniz!');
            return;
        }

        try {
            const response = await fetch(`/api/bahane/${currentBahaneId}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                // Oy sayısını güncelle
                document.getElementById('oyCount').textContent = data.data.votes;
                document.getElementById('oyVerBtn').classList.add('voted');
                alert('Oy başarıyla verildi! 👍');
            } else {
                if (data.message.includes('kendi bahanene')) {
                    alert('Kendi bahanene oy veremezsin! 😅');
                } else {
                    throw new Error(data.message || 'Oy verme işlemi başarısız oldu');
                }
            }
        } catch (err) {
            console.error('Oy verme hatası:', err);
            alert(err.message || 'Oy verirken bir hata oluştu!');
        }
    };

    // Sayfa yüklendiğinde ilk bahaneyi üret
    bahaneUret();
}); 