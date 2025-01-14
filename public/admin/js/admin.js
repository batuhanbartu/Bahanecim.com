document.addEventListener('DOMContentLoaded', () => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // DOM elementleri
    const userTableBody = document.querySelector('#usersTable tbody');
    const bahaneTableBody = document.querySelector('#bahanelerTable tbody');
    const userSearchInput = document.getElementById('userSearchInput');
    const bahaneSearchInput = document.getElementById('bahaneSearchInput');

    // API endpoint'leri
    const API_ENDPOINTS = {
        USERS: '/api/admin/users',
        BAHANELER: '/api/admin/bahaneler',
        USER_TOGGLE: (id) => `/api/admin/users/${id}/toggle`,
        USER_DELETE: (id) => `/api/admin/users/${id}`,
        BAHANE_DELETE: (id) => `/api/admin/bahaneler/${id}`
    };

    // Kullanıcıları getir
    async function loadUsers() {
        try {
            const response = await fetch(API_ENDPOINTS.USERS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Users response:', data); // Debug için

            if (data.status === 'success') {
                userTableBody.innerHTML = data.data.map(user => `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>
                            <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                                ${user.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                        </td>
                        <td>
                            <button onclick="toggleUserStatus('${user._id}')" class="action-btn toggle-btn">
                                ${user.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                            </button>
                            <button onclick="deleteUser('${user._id}')" class="action-btn delete-btn">Sil</button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error('Kullanıcılar yüklenirken hata:', err);
        }
    }

    // Bahaneleri getir
    async function loadBahaneler() {
        try {
            const response = await fetch('/api/admin/bahaneler', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.status === 'success') {
                bahaneTableBody.innerHTML = data.data.map(bahane => `
                    <tr>
                        <td>${bahane.content}</td>
                        <td>${bahane.category}</td>
                        <td>${bahane.author ? bahane.author.username : 'Bilinmiyor'}</td>
                        <td>${bahane.votes || 0}</td>
                        <td>
                            <button onclick="deleteBahane('${bahane._id}')" class="action-btn delete-btn">Sil</button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error('Bahaneler yüklenirken hata:', err);
        }
    }

    // Kullanıcı durumunu değiştir
    window.toggleUserStatus = async (userId) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/toggle`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                loadUsers(); // Tabloyu yenile
            }
        } catch (err) {
            console.error('Kullanıcı durumu değiştirilirken hata:', err);
        }
    };

    // Kullanıcı sil
    window.deleteUser = async (userId) => {
        if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    loadUsers(); // Tabloyu yenile
                }
            } catch (err) {
                console.error('Kullanıcı silinirken hata:', err);
            }
        }
    };

    // Bahane sil
    window.deleteBahane = async (bahaneId) => {
        if (confirm('Bu bahaneyi silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/api/admin/bahaneler/${bahaneId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    loadBahaneler(); // Tabloyu yenile
                }
            } catch (err) {
                console.error('Bahane silinirken hata:', err);
            }
        }
    };

    // Tab değiştirme
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.id === 'logoutBtn') return; // Çıkış butonunu atla
            if (link.getAttribute('href') === '/') { // Ana sayfaya yönlendirme
                window.location.href = '/';
                return;
            }
            
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('href').substring(1);
            document.querySelectorAll('.section').forEach(section => {
                section.classList.toggle('active', section.id === targetId);
            });

            // Sekme değiştiğinde ilgili verileri yükle
            if (targetId === 'users') loadUsers();
            if (targetId === 'bahaneler') loadBahaneler();
        });
    });

    // Çıkış yap
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Sayfa yüklendiğinde verileri getir
    loadUsers();
    loadBahaneler();

    // Bahane arama ve filtreleme
    function filterBahaneler() {
        const searchTerm = bahaneSearchInput.value.toLowerCase();
        const selectedKategori = document.getElementById('bahaneKategoriFilter').value;
        const rows = document.querySelectorAll('#bahanelerTable tbody tr');

        rows.forEach(row => {
            const content = row.cells[0].textContent.toLowerCase();
            const kategori = row.cells[1].textContent;
            const matchesSearch = content.includes(searchTerm);
            const matchesKategori = !selectedKategori || kategori === selectedKategori;
            
            row.style.display = matchesSearch && matchesKategori ? '' : 'none';
        });
    }

    // Event listener'ları ekle
    bahaneSearchInput.addEventListener('input', filterBahaneler);
    document.getElementById('bahaneKategoriFilter').addEventListener('change', filterBahaneler);

    // Kullanıcı arama fonksiyonu
    function filterUsers() {
        const searchTerm = userSearchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#usersTable tbody tr');

        rows.forEach(row => {
            const username = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            const matches = username.includes(searchTerm) || email.includes(searchTerm);
            
            row.style.display = matches ? '' : 'none';
        });
    }

    // Event listener ekle
    userSearchInput.addEventListener('input', filterUsers);
}); 