document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Kullanıcı bilgisini al
    const user = JSON.parse(localStorage.getItem('user'));

    // Bahaneleri yükle ve göster
    async function bahaneleriYukle() {
        try {
            const response = await fetch('/api/bahane/popular', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            const container = document.getElementById('bahanelerContainer');
            
            if (data.results === 0) {
                container.innerHTML = `
                    <div class="no-bahane">
                        Henüz hiç bahane yok! 😢<br>
                        <a href="/bahane-ekle.html">İlk bahaneyi sen ekle!</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = data.data.map(bahane => {
                const isOwnBahane = bahane.author._id === user._id;
                return `
                    <div class="bahane-card" data-id="${bahane._id}">
                        <span class="kategori-badge">${bahane.category}</span>
                        <p class="bahane-content">${bahane.content}</p>
                        <div class="bahane-meta">
                            <span class="author">by ${bahane.author.username} ${isOwnBahane ? '(Senin Bahanen)' : ''}</span>
                            <div class="vote-actions">
                                <button onclick="oyVer('${bahane._id}')" 
                                    class="vote-btn ${bahane.hasVoted ? 'voted' : ''}"
                                    ${isOwnBahane ? 'disabled title="Kendi bahanene oy veremezsin"' : ''}>
                                    <span class="vote-count">${bahane.votes}</span>
                                    <span class="vote-icon">👍</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (err) {
            console.error('Bahaneler yüklenirken hata:', err);
            document.getElementById('bahanelerContainer').innerHTML = `
                <div class="no-bahane">
                    Bir hata oluştu! 😅<br>
                    Lütfen daha sonra tekrar deneyin.
                </div>
            `;
        }
    }

    // İlk yükleme
    await bahaneleriYukle();

    // Oy verme fonksiyonu
    window.oyVer = async (bahaneId) => {
        if (!bahaneId) {
            console.error('Bahane ID bulunamadı');
            return;
        }

        try {
            const response = await fetch(`/api/bahane/${bahaneId}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // Özel hata mesajlarını kontrol et
                if (data.message.includes('kendi bahanene')) {
                    throw new Error('Kendi bahanene oy veremezsin! 😅');
                }
                throw new Error(data.message || 'Oy verme işlemi başarısız oldu');
            }

            if (data.status === 'success') {
                // Oy sayısını güncelle
                const bahaneCard = document.querySelector(`.bahane-card[data-id="${bahaneId}"]`);
                if (bahaneCard) {
                    const voteBtn = bahaneCard.querySelector('.vote-btn');
                    const voteCount = voteBtn.querySelector('.vote-count');
                    voteCount.textContent = data.data.votes;
                    voteBtn.classList.toggle('voted');
                    alert('Oy başarıyla verildi! 👍');
                }
            } else {
                throw new Error(data.message || 'Oy verme işlemi başarısız oldu');
            }
        } catch (err) {
            console.error('Oy verme hatası:', err);
            alert(err.message || 'Oy verirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    };

    // Çıkış yapma işlemi
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });
}); 