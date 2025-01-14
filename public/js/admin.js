document.addEventListener('DOMContentLoaded', () => {
    // Token ve admin kontrolü
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'admin') {
        window.location.href = '/';
        return;
    }

    // DOM elementleri
    const navLinks = document.querySelectorAll('.admin-sidebar nav a');
    const sections = document.querySelectorAll('.admin-section');
    const logoutBtn = document.getElementById('logoutBtn');

    // Sayfa yönetimi
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    }

    // Navigasyon
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            loadSectionData(sectionId);
        });
    });

    // Kullanıcıları yükle
    async function loadUsers() {
        try {
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            const tbody = document.querySelector('#usersTable tbody');
            tbody.innerHTML = data.data.map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                            ${user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn toggle-btn" onclick="toggleUserStatus('${user._id}')">
                            ${user.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Kullanıcı yükleme hatası:', err);
            alert('Kullanıcılar yüklenirken bir hata oluştu!');
        }
    }

    // Bahaneleri yükle
    async function loadBahaneler() {
        try {
            const response = await fetch('/api/admin/bahaneler', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            const tbody = document.querySelector('#bahanelerTable tbody');
            tbody.innerHTML = data.data.map(bahane => `
                <tr>
                    <td>${bahane.content}</td>
                    <td>${bahane.category}</td>
                    <td>${bahane.author?.username || 'Silinmiş Kullanıcı'}</td>
                    <td>${bahane.votes}</td>
                    <td>
                        <button onclick="deleteBahane('${bahane._id}')" class="action-btn delete-btn">
                            Sil
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Bahane yükleme hatası:', err);
            alert('Bahaneler yüklenirken bir hata oluştu!');
        }
    }

    // Bölüm verilerini yükle
    function loadSectionData(sectionId) {
        switch(sectionId) {
            case 'users':
                loadUsers();
                break;
            case 'bahaneler':
                loadBahaneler();
                break;
        }
    }

    // Kullanıcı durumunu değiştir
    window.toggleUserStatus = async (userId) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadUsers();
            }
        } catch (err) {
            console.error('Kullanıcı durumu değiştirme hatası:', err);
            alert('İşlem başarısız oldu!');
        }
    };

    // Bahane sil
    window.deleteBahane = async (bahaneId) => {
        if (!confirm('Bu bahaneyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const response = await fetch(`/api/bahane/${bahaneId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadBahaneler();
            }
        } catch (err) {
            console.error('Bahane silme hatası:', err);
            alert('Silme işlemi başarısız oldu!');
        }
    };

    // Çıkış yap
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // İlk sayfayı yükle
    loadUsers();
}); 