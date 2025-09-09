// Data Dummy (Contoh)
const mockUsers = {
    "199001012020121001": { name: "Dr. Budi Santoso, M.Pd.", role: "Kepala Sekolah", password: "01011990" },
    "199205102021012002": { name: "Siti Aminah, S.Pd.", role: "Wali Kelas", password: "10051992", waliKelas: "IX A" },
    "199503152022031003": { name: "Joko Susilo, S.Kom.", role: "Guru", password: "15031995" },
    "admin": { name: "Administrator", role: "Admin", password: "admin" }
};

const mockKelas = [
    { id: "7A", name: "VII A", wali: "Joko Susilo, S.Kom." },
    { id: "7B", name: "VII B", wali: "Sri Rahayu, S.Pd." },
    { id: "8A", name: "VIII A", wali: "Eko Prasetyo, M.Pd." },
    { id: "9A", name: "IX A", wali: "Siti Aminah, S.Pd." }
];

const mockSiswa = {
    "7A": [{ nis: "12345", name: "Adi Saputra", namaOrtu: "Bambang", noHp: "081234567890" }],
    "7B": [{ nis: "12346", name: "Bella Ciao", namaOrtu: "Rini", noHp: "081234567891" }],
    "8A": [{ nis: "12347", name: "Candra Wijaya", namaOrtu: "Susilo", noHp: "081234567892" }],
    "9A": [{ nis: "12348", name: "Dewi Lestari", namaOrtu: "Joko", noHp: "081234567893" }, { nis: "12349", name: "Eka Putri", namaOrtu: "Sari", noHp: "081234567894" }]
};

const mockAbsensi = {
    "2023-10-26": {
        "9A": {
            "12348": "H", "12349": "S"
        },
        "7A": {
            "12345": "H"
        }
    },
    "2023-10-27": {
         "9A": {
            "12348": "H", "12349": "H"
        }
    }
};

const mockAnnouncements = [
    "Selamat datang di SIAP Hadir. Sistem Absensi Online SMPN 3 Lempuing Jaya.",
    "Batas waktu pengisian absensi adalah pukul 08:00 WIB setiap harinya.",
    "Untuk kendala teknis, silakan hubungi Administrator."
];

let currentUser = {};

// Event Listener Utama
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
    
    // Navigasi
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1) + 'Page';
            navigateTo(pageId);
            // Tutup sidebar di mobile setelah klik
            if(window.innerWidth < 768){
                document.getElementById('sidebar').classList.add('-translate-x-full');
            }
        });
    });

    // Toggle menu
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('-translate-x-full');
    });

    // Set tanggal dan waktu
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update setiap detik
    
    // Set pengumuman berjalan
    document.getElementById('announcement').textContent = mockAnnouncements.join(' | ');

    navigateTo('dashboardPage');
});

// Fungsi-fungsi
function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('id-ID', optionsDate);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function handleLogin(e) {
    e.preventDefault();
    const nip = document.getElementById('nip').value;
    const password = document.getElementById('password').value;
    const user = mockUsers[nip];

    if (user && user.password === password) {
        currentUser = user;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        setupUIForUser();
        navigateTo('dashboardPage');
    } else {
        document.getElementById('loginError').textContent = 'NIP atau Password salah.';
    }
}

function handleLogout() {
    currentUser = {};
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = '';
}

function setupUIForUser() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role;

    const adminOnlyElements = document.querySelectorAll('.admin-only');
    if (currentUser.role === 'Admin') {
        adminOnlyElements.forEach(el => el.style.display = 'block');
    } else {
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    const pageTitle = pageId.replace('Page', '').replace(/([A-Z])/g, ' $1').trim();
    document.getElementById('pageTitle').textContent = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
    
    // Render konten sesuai halaman
    switch(pageId) {
        case 'dashboardPage':
            renderDashboard();
            break;
        case 'absensiSiswaPage':
            renderAbsensiSiswa();
            break;
        case 'lihatAbsensiPage':
            renderLihatAbsensi();
            break;
        case 'rekapAbsensiPage':
            renderRekapAbsensi();
            break;
        case 'manajemenKelasPage':
            renderManajemenKelas();
            break;
        case 'manajemenSiswaPage':
            renderManajemenSiswa();
            break;
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const icon = document.getElementById('password-toggle-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Render Functions
function renderDashboard() {
    const today = new Date().toISOString().slice(0,10);
    const totalSiswa = Object.values(mockSiswa).flat().length;
    let totalHadir = 0;
    if (mockAbsensi[today]) {
        totalHadir = Object.values(mockAbsensi[today]).flatMap(Object.values).filter(status => status === 'H').length;
    }
    const persentaseHadir = totalSiswa > 0 ? ((totalHadir / totalSiswa) * 100).toFixed(1) : 0;

    document.getElementById('dashboardPage').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
                <div>
                    <p class="text-lg">Total Siswa</p>
                    <p class="text-4xl font-bold">${totalSiswa}</p>
                </div>
                <i class="fas fa-users fa-3x text-blue-300"></i>
            </div>
            <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
                <div>
                    <p class="text-lg">Kehadiran Hari Ini</p>
                    <p class="text-4xl font-bold">${totalHadir}</p>
                </div>
                <i class="fas fa-user-check fa-3x text-green-300"></i>
            </div>
            <div class="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
                <div>
                    <p class="text-lg">Persentase Kehadiran</p>
                    <p class="text-4xl font-bold">${persentaseHadir}%</p>
                </div>
                <i class="fas fa-chart-pie fa-3x text-yellow-300"></i>
            </div>
        </div>
        <div class="mt-8 bg-white p-6 rounded-lg shadow-lg">
             <h3 class="text-xl font-bold mb-4">Selamat Datang, ${currentUser.name}!</h3>
             <p class="text-gray-600">Anda login sebagai ${currentUser.role}. Gunakan menu di samping untuk mengelola data absensi siswa. Pastikan data yang Anda masukkan sudah benar dan sesuai.</p>
        </div>
    `;
}

function renderAbsensiSiswa() {
    const today = new Date().toISOString().slice(0,10);
    let kelasOptions = mockKelas;
    
    if(currentUser.role === "Wali Kelas"){
        kelasOptions = mockKelas.filter(k => k.name === currentUser.waliKelas);
    }
    
    const kelasDropdown = `
        <select id="pilihKelas" class="p-2 border rounded-md">
            ${kelasOptions.map(k => `<option value="${k.id}">${k.name}</option>`).join('')}
        </select>
        <button onclick="tampilkanSiswaUntukAbsen()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Tampilkan</button>
    `;

    document.getElementById('absensiSiswaPage').innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4">Formulir Absensi Siswa (${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})</h3>
            <div class="flex items-center space-x-4 mb-4">
                <label for="pilihKelas">Pilih Kelas:</label>
                ${kelasDropdown}
            </div>
            <div id="daftarSiswaUntukAbsen" class="mt-4"></div>
        </div>
    `;
    if(kelasOptions.length > 0) tampilkanSiswaUntukAbsen(); // Auto-load first class
}

function tampilkanSiswaUntukAbsen() {
    const kelasId = document.getElementById('pilihKelas').value;
    const siswaDiKelas = mockSiswa[kelasId] || [];
    const today = new Date().toISOString().slice(0,10);
    mockAbsensi[today] = mockAbsensi[today] || {};
    mockAbsensi[today][kelasId] = mockAbsensi[today][kelasId] || {};
    
    if (siswaDiKelas.length === 0) {
        document.getElementById('daftarSiswaUntukAbsen').innerHTML = '<p class="text-gray-500">Tidak ada siswa di kelas ini.</p>';
        return;
    }

    const tableRows = siswaDiKelas.map((siswa, index) => {
        const absensiHariIni = mockAbsensi[today][kelasId][siswa.nis] || 'H';
        return `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 text-center">${index + 1}</td>
                <td class="p-3">${siswa.name}</td>
                <td class="p-3 text-center">${siswa.nis}</td>
                <td class="p-3">
                    <div class="flex justify-center space-x-2">
                        <label class="flex items-center"><input type="radio" name="absen-${siswa.nis}" value="H" ${absensiHariIni === 'H' ? 'checked' : ''} class="mr-1"> H</label>
                        <label class="flex items-center"><input type="radio" name="absen-${siswa.nis}" value="S" ${absensiHariIni === 'S' ? 'checked' : ''} class="mr-1"> S</label>
                        <label class="flex items-center"><input type="radio" name="absen-${siswa.nis}" value="I" ${absensiHariIni === 'I' ? 'checked' : ''} class="mr-1"> I</label>
                        <label class="flex items-center"><input type="radio" name="absen-${siswa.nis}" value="A" ${absensiHariIni === 'A' ? 'checked' : ''} class="mr-1"> A</label>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('daftarSiswaUntukAbsen').innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-3 text-center w-12">No</th>
                        <th class="p-3">Nama Siswa</th>
                        <th class="p-3 text-center">NIS</th>
                        <th class="p-3 text-center">Kehadiran</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <div class="mt-6 text-right">
            <button onclick="simpanAbsensi('${kelasId}')" class="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">Simpan Absensi</button>
        </div>
    `;
}

function simpanAbsensi(kelasId) {
    const today = new Date().toISOString().slice(0,10);
    const siswaDiKelas = mockSiswa[kelasId] || [];

    siswaDiKelas.forEach(siswa => {
        const status = document.querySelector(`input[name="absen-${siswa.nis}"]:checked`).value;
        mockAbsensi[today][kelasId][siswa.nis] = status;
    });
    
    showSuccessToast("Absensi berhasil disimpan!");
}

function renderLihatAbsensi() {
    const today = new Date().toISOString().slice(0,10);
    const kelasDropdown = `
        <select id="pilihKelasLihat" class="p-2 border rounded-md">
            ${mockKelas.map(k => `<option value="${k.id}">${k.name}</option>`).join('')}
        </select>
    `;

    document.getElementById('lihatAbsensiPage').innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4">Lihat Data Absensi</h3>
            <div class="flex items-center space-x-4 mb-4">
                <label>Pilih Tanggal:</label>
                <input type="date" id="pilihTanggal" value="${today}" class="p-2 border rounded-md">
                <label>Pilih Kelas:</label>
                ${kelasDropdown}
                <button onclick="tampilkanDataAbsensi()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Tampilkan</button>
            </div>
            <div id="dataAbsensiContainer" class="mt-4"></div>
        </div>
    `;
    tampilkanDataAbsensi();
}

function tampilkanDataAbsensi() {
    const tanggal = document.getElementById('pilihTanggal').value;
    const kelasId = document.getElementById('pilihKelasLihat').value;
    const dataAbsensiHariIni = mockAbsensi[tanggal] ? mockAbsensi[tanggal][kelasId] : null;
    const siswaDiKelas = mockSiswa[kelasId] || [];

    if (!dataAbsensiHariIni || siswaDiKelas.length === 0) {
        document.getElementById('dataAbsensiContainer').innerHTML = '<p class="text-gray-500">Data absensi tidak ditemukan untuk tanggal dan kelas yang dipilih.</p>';
        return;
    }

    const statusColors = { H: 'bg-green-100 text-green-800', S: 'bg-blue-100 text-blue-800', I: 'bg-yellow-100 text-yellow-800', A: 'bg-red-100 text-red-800' };
    const statusText = { H: 'Hadir', S: 'Sakit', I: 'Izin', A: 'Alfa' };
    
    const tableRows = siswaDiKelas.map((siswa, index) => {
        const status = dataAbsensiHariIni[siswa.nis] || '-';
        return `
            <tr class="border-b">
                <td class="p-3 text-center">${index + 1}</td>
                <td class="p-3">${siswa.name}</td>
                <td class="p-3 text-center">${siswa.nis}</td>
                <td class="p-3 text-center">
                    <span class="px-2 py-1 font-semibold leading-tight rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}">
                        ${statusText[status] || 'Belum Absen'}
                    </span>
                </td>
            </tr>
        `;
    }).join('');

     document.getElementById('dataAbsensiContainer').innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-3 text-center w-12">No</th>
                        <th class="p-3">Nama Siswa</th>
                        <th class="p-3 text-center">NIS</th>
                        <th class="p-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    `;
}

function renderRekapAbsensi() {
    const kelasDropdown = `
        <select id="pilihKelasRekap" class="p-2 border rounded-md">
            ${mockKelas.map(k => `<option value="${k.id}">${k.name}</option>`).join('')}
        </select>
    `;
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0,10);

    document.getElementById('rekapAbsensiPage').innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="no-print">
                <h3 class="text-xl font-bold mb-4">Rekapitulasi Absensi Bulanan</h3>
                <div class="flex items-center space-x-4 mb-4">
                    <label>Periode:</label>
                    <input type="date" id="tanggalMulai" value="${firstDay}" class="p-2 border rounded-md">
                    <span>s/d</span>
                    <input type="date" id="tanggalSelesai" value="${lastDay}" class="p-2 border rounded-md">
                    <label>Kelas:</label>
                    ${kelasDropdown}
                    <button onclick="tampilkanRekapAbsensi()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Tampilkan Rekap</button>
                    <button onclick="printRekap()" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"><i class="fas fa-print mr-2"></i>Cetak</button>
                </div>
            </div>
            <div id="rekapContainer" class="mt-4"></div>
        </div>
    `;
    tampilkanRekapAbsensi();
}

function tampilkanRekapAbsensi() {
    const kelasId = document.getElementById('pilihKelasRekap').value;
    const kelasInfo = mockKelas.find(k => k.id === kelasId);
    const siswaDiKelas = mockSiswa[kelasId] || [];
    const tglMulai = new Date(document.getElementById('tanggalMulai').value);
    const tglSelesai = new Date(document.getElementById('tanggalSelesai').value);
    
    const rekapData = siswaDiKelas.map(siswa => {
        const rekap = { H: 0, S: 0, I: 0, A: 0 };
        for (let d = new Date(tglMulai); d <= tglSelesai; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().slice(0, 10);
            if (mockAbsensi[dateString] && mockAbsensi[dateString][kelasId]) {
                const status = mockAbsensi[dateString][kelasId][siswa.nis];
                if (status) {
                    rekap[status]++;
                }
            }
        }
        return { ...siswa, rekap };
    });

    const tableRows = rekapData.map((data, index) => `
        <tr class="border-b">
            <td class="p-2 border text-center">${index + 1}</td>
            <td class="p-2 border">${data.name}</td>
            <td class="p-2 border text-center">${data.nis}</td>
            <td class="p-2 border text-center">${data.rekap.H}</td>
            <td class="p-2 border text-center">${data.rekap.S}</td>
            <td class="p-2 border text-center">${data.rekap.I}</td>
            <td class="p-2 border text-center">${data.rekap.A}</td>
        </tr>
    `).join('');
    
    document.getElementById('rekapContainer').innerHTML = `
        <div class="print-only text-center mb-4">
            <h2 class="text-2xl font-bold">REKAPITULASI ABSENSI SISWA</h2>
            <h3 class="text-xl">SMPN 3 LEMPUING JAYA</h3>
            <p>Kelas: ${kelasInfo.name}</p>
            <p>Periode: ${tglMulai.toLocaleDateString('id-ID')} - ${tglSelesai.toLocaleDateString('id-ID')}</p>
        </div>
        <table class="w-full text-left border-collapse border border-gray-400">
            <thead class="bg-gray-200">
                <tr>
                    <th class="p-2 border border-gray-300 text-center">No</th>
                    <th class="p-2 border border-gray-300">Nama Siswa</th>
                    <th class="p-2 border border-gray-300 text-center">NIS</th>
                    <th class="p-2 border border-gray-300 text-center">Hadir</th>
                    <th class="p-2 border border-gray-300 text-center">Sakit</th>
                    <th class="p-2 border border-gray-300 text-center">Izin</th>
                    <th class="p-2 border border-gray-300 text-center">Alfa</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
        <div class="print-only mt-8 flex justify-between text-center">
            <div>
                <p>Mengetahui,</p>
                <p>Kepala Sekolah</p>
                <br><br><br>
                <p class="font-bold underline">${mockUsers["199001012020121001"].name}</p>
                <p>NIP. 199001012020121001</p>
            </div>
            <div>
                <p>Lempuing Jaya, ${new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                <p>Wali Kelas</p>
                <br><br><br>
                <p class="font-bold underline">${kelasInfo.wali}</p>
                <p>NIP. ${Object.keys(mockUsers).find(key => mockUsers[key].name === kelasInfo.wali)}</p>
            </div>
        </div>
    `;
}

function printRekap() {
    window.print();
}

function renderManajemenKelas() {
    const tableRows = mockKelas.map((kelas, index) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 text-center">${index + 1}</td>
            <td class="p-3">${kelas.name}</td>
            <td class="p-3">${kelas.wali}</td>
            <td class="p-3 text-center">${(mockSiswa[kelas.id] || []).length}</td>
            <td class="p-3 text-center">
                <button onclick="editKelas('${kelas.id}')" class="text-blue-500 hover:text-blue-700 mr-2"><i class="fas fa-edit"></i></button>
                <button onclick="hapusKelas('${kelas.id}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    document.getElementById('manajemenKelasPage').innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Data Kelas</h3>
                <button onclick="tambahKelas()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"><i class="fas fa-plus mr-2"></i> Tambah Kelas</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3 text-center w-12">No</th>
                            <th class="p-3">Nama Kelas</th>
                            <th class="p-3">Wali Kelas</th>
                            <th class="p-3 text-center">Jumlah Siswa</th>
                            <th class="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function tambahKelas() {
    showModal('Tambah Kelas Baru', `
        <form id="formKelas">
            <input type="hidden" id="kelasId" value="">
            <div class="mb-4">
                <label for="namaKelas" class="block text-sm font-medium text-gray-700">Nama Kelas</label>
                <input type="text" id="namaKelas" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div class="mb-4">
                <label for="waliKelas" class="block text-sm font-medium text-gray-700">Wali Kelas</label>
                <input type="text" id="waliKelas" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div class="text-right">
                <button type="button" onclick="closeModal()" class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 mr-2">Batal</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('formKelas').addEventListener('submit', simpanKelas);
}

function editKelas(id) {
    const kelas = mockKelas.find(k => k.id === id);
    if (kelas) {
        tambahKelas(); // reuse the form
        document.getElementById('modal-title').innerText = 'Edit Data Kelas';
        document.getElementById('kelasId').value = kelas.id;
        document.getElementById('namaKelas').value = kelas.name;
        document.getElementById('waliKelas').value = kelas.wali;
    }
}

function simpanKelas(e) {
    e.preventDefault();
    const id = document.getElementById('kelasId').value;
    const name = document.getElementById('namaKelas').value;
    const wali = document.getElementById('waliKelas').value;
    const newId = name.replace(/\s+/g, '');

    if (id) { // Edit
        const index = mockKelas.findIndex(k => k.id === id);
        mockKelas[index] = { id: newId, name, wali };
    } else { // Tambah
        mockKelas.push({ id: newId, name, wali });
        mockSiswa[newId] = []; // Inisialisasi data siswa untuk kelas baru
    }
    
    showSuccessToast('Data kelas berhasil disimpan.');
    renderManajemenKelas();
    updateAllKelasDropdowns();
    closeModal();
}

function hapusKelas(id) {
    if (confirm(`Yakin ingin menghapus kelas ini? Ini akan menghapus semua data siswa di dalamnya.`)) {
        const index = mockKelas.findIndex(k => k.id === id);
        mockKelas.splice(index, 1);
        delete mockSiswa[id];
        
        showSuccessToast('Kelas berhasil dihapus.');
        renderManajemenKelas();
        updateAllKelasDropdowns();
    }
}

function renderManajemenSiswa() {
    const kelasDropdown = `
        <select id="filterKelasSiswa" class="p-2 border rounded-md" onchange="renderManajemenSiswa()">
            <option value="all">Semua Kelas</option>
            ${mockKelas.map(k => `<option value="${k.id}">${k.name}</option>`).join('')}
        </select>
    `;

    const selectedKelas = document.getElementById('filterKelasSiswa')?.value || 'all';

    let siswaList = [];
    if (selectedKelas === 'all') {
        siswaList = Object.entries(mockSiswa).flatMap(([kelasId, siswas]) => siswas.map(s => ({...s, kelasId})));
    } else {
        siswaList = (mockSiswa[selectedKelas] || []).map(s => ({...s, kelasId: selectedKelas}));
    }

    const tableRows = siswaList.map((siswa, index) => `
         <tr class="border-b hover:bg-gray-50">
            <td class="p-3 text-center">${index + 1}</td>
            <td class="p-3">${siswa.name}</td>
            <td class="p-3 text-center">${siswa.nis}</td>
            <td class="p-3">${mockKelas.find(k => k.id === siswa.kelasId)?.name || 'N/A'}</td>
            <td class="p-3">${siswa.namaOrtu}</td>
            <td class="p-3">${siswa.noHp}</td>
            <td class="p-3 text-center">
                <button onclick="editSiswa('${siswa.nis}', '${siswa.kelasId}')" class="text-blue-500 hover:text-blue-700 mr-2"><i class="fas fa-edit"></i></button>
                <button onclick="hapusSiswa('${siswa.nis}', '${siswa.kelasId}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    document.getElementById('manajemenSiswaPage').innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Data Siswa</h3>
                <div>
                    <label>Filter Kelas: </label>
                    ${kelasDropdown}
                    <button onclick="tambahSiswa()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-4"><i class="fas fa-plus mr-2"></i> Tambah Siswa</button>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3 text-center w-12">No</th>
                            <th class="p-3">Nama Siswa</th>
                            <th class="p-3 text-center">NIS</th>
                            <th class="p-3">Kelas</th>
                            <th class="p-3">Nama Ortu/Wali</th>
                            <th class="p-3">No. HP</th>
                            <th class="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows || '<tr><td colspan="7" class="text-center p-4 text-gray-500">Tidak ada data siswa.</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
    // Preserve filter selection
    if (document.getElementById('filterKelasSiswa')) {
        document.getElementById('filterKelasSiswa').value = selectedKelas;
    }
}

function tambahSiswa() {
    const kelasOptions = mockKelas.map(k => `<option value="${k.id}">${k.name}</option>`).join('');
    showModal('Tambah Siswa Baru', `
        <form id="formSiswa">
            <input type="hidden" id="siswaNisOriginal">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div class="mb-4">
                    <label for="nisSiswa" class="block text-sm font-medium text-gray-700">NIS</label>
                    <input type="text" id="nisSiswa" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                </div>
                <div class="mb-4">
                    <label for="namaSiswa" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input type="text" id="namaSiswa" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                </div>
                 <div class="mb-4">
                    <label for="kelasSiswa" class="block text-sm font-medium text-gray-700">Kelas</label>
                    <select id="kelasSiswa" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>${kelasOptions}</select>
                </div>
                <div class="mb-4">
                    <label for="namaOrtu" class="block text-sm font-medium text-gray-700">Nama Ortu/Wali</label>
                    <input type="text" id="namaOrtu" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                <div class="mb-4">
                    <label for="noHp" class="block text-sm font-medium text-gray-700">No. HP Ortu/Wali</label>
                    <input type="tel" id="noHp" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
            </div>
            <div class="text-right mt-4">
                <button type="button" onclick="closeModal()" class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 mr-2">Batal</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Simpan</button>
            </div>
        </form>
    `);
    document.getElementById('formSiswa').addEventListener('submit', simpanSiswa);
}

function editSiswa(nis, kelasId) {
    const siswa = mockSiswa[kelasId].find(s => s.nis === nis);
    if (siswa) {
        tambahSiswa(); // reuse form
        document.getElementById('modal-title').innerText = 'Edit Data Siswa';
        document.getElementById('siswaNisOriginal').value = nis;
        document.getElementById('nisSiswa').value = siswa.nis;
        // document.getElementById('nisSiswa').readOnly = true; // NIS as primary key shouldn't be changed easily
        document.getElementById('namaSiswa').value = siswa.name;
        document.getElementById('kelasSiswa').value = kelasId;
        document.getElementById('namaOrtu').value = siswa.namaOrtu;
        document.getElementById('noHp').value = siswa.noHp;
    }
}

function simpanSiswa(e) {
    e.preventDefault();
    const originalNis = document.getElementById('siswaNisOriginal').value;
    const nis = document.getElementById('nisSiswa').value;
    const name = document.getElementById('namaSiswa').value;
    const kelasId = document.getElementById('kelasSiswa').value;
    const namaOrtu = document.getElementById('namaOrtu').value;
    const noHp = document.getElementById('noHp').value;
    
    const siswaData = { nis, name, namaOrtu, noHp };
    
    // Cari siswa di kelas baru (untuk edit)
    const siswaIndex = mockSiswa[kelasId].findIndex(s => s.nis === nis);
    
    if (siswaIndex > -1) { // Edit
        mockSiswa[kelasId][siswaIndex] = siswaData;
    } else { // Tambah
        mockSiswa[kelasId].push(siswaData);
    }
    
    showSuccessToast('Data siswa berhasil disimpan.');
    renderManajemenSiswa();
    renderManajemenKelas(); // update jumlah siswa
    closeModal();
}

function hapusSiswa(nis, kelasId) {
    if(confirm(`Yakin ingin menghapus siswa dengan NIS ${nis}?`)) {
        mockSiswa[kelasId] = mockSiswa[kelasId].filter(s => s.nis !== nis);
        showSuccessToast('Siswa berhasil dihapus.');
        renderManajemenSiswa();
        renderManajemenKelas();
    }
}

// Helper Functions
function updateAllKelasDropdowns() {
    const dropdowns = [
        document.getElementById('pilihKelas'),
        document.getElementById('pilihKelasLihat'),
        document.getElementById('pilihKelasRekap'),
        document.getElementById('filterKelasSiswa')
    ];
    
    const optionsHtml = mockKelas.map(k => `<option value="${k.id}">${k.name}</option>`).join('');
    
    dropdowns.forEach(dropdown => {
        if(dropdown) {
            // Keep the selected value if possible
            const selectedValue = dropdown.value;
            dropdown.innerHTML = dropdown.id === 'filterKelasSiswa' ? `<option value="all">Semua Kelas</option>${optionsHtml}` : optionsHtml;
            if ([...dropdown.options].map(o => o.value).includes(selectedValue)) {
                dropdown.value = selectedValue;
            }
        }
    });
}

function showModal(title, body) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-title').innerText = '';
    document.getElementById('modal-body').innerHTML = '';
}

function showSuccessToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('opacity-0');
    setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 3000);
}
