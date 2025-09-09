// ... existing code ... -->
    "9A": [{ nis: "12348", name: "Dewi Lestari", namaOrtu: "Joko", noHp: "081234567893" }, { nis: "12349", name: "Eka Putri", namaOrtu: "Sari", noHp: "081234567894" }]
};

const mockAbsensiGuru = {
    "2023-10-27": {
        "199205102021012002": { masuk: "07:15", pulang: "15:30", status: "Hadir" },
        "199503152022031003": { masuk: "07:30", pulang: null, status: "Hadir" }
    }
};

const mockAbsensi = {
    "2023-10-26": {
        "9A": {
// ... existing code ... -->
    // Render konten sesuai halaman
    switch(pageId) {
        case 'dashboardPage':
            renderDashboard();
            break;
        case 'absensiGuruPage':
            renderAbsensiGuru();
            break;
        case 'absensiSiswaPage':
            renderAbsensiSiswa();
            break;
        case 'lihatAbsensiPage':
// ... existing code ... -->
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

function renderAbsensiGuru() {
    const today = new Date().toISOString().slice(0, 10);
    const nip = Object.keys(mockUsers).find(key => mockUsers[key] === currentUser);
    
    // Inisialisasi data absensi hari ini jika belum ada
    if (!mockAbsensiGuru[today]) {
        mockAbsensiGuru[today] = {};
    }
    const absensiHariIni = mockAbsensiGuru[today][nip] || null;

    let statusText = "Anda belum melakukan absensi hari ini.";
    let tombolMasukDisabled = '';
    let tombolPulangDisabled = 'disabled';
    
    if (absensiHariIni) {
        if (absensiHariIni.masuk && absensiHariIni.pulang) {
            statusText = `Anda telah absen masuk pukul ${absensiHariIni.masuk} dan pulang pukul ${absensiHariIni.pulang}.`;
            tombolMasukDisabled = 'disabled';
            tombolPulangDisabled = 'disabled';
        } else if (absensiHariIni.masuk) {
            statusText = `Anda sudah absen masuk hari ini pada pukul ${absensiHariIni.masuk}.`;
            tombolMasukDisabled = 'disabled';
            tombolPulangDisabled = '';
        }
    }

    // History Absensi
    const historyRows = Object.keys(mockAbsensiGuru).reverse().map(tanggal => {
        if (mockAbsensiGuru[tanggal][nip]) {
            const absensi = mockAbsensiGuru[tanggal][nip];
            return `
                <tr class="border-b">
                    <td class="p-3">${new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td class="p-3 text-center">${absensi.masuk || '-'}</td>
                    <td class="p-3 text-center">${absensi.pulang || '-'}</td>
                    <td class="p-3 text-center"><span class="px-2 py-1 font-semibold leading-tight rounded-full bg-green-100 text-green-800">${absensi.status}</span></td>
                </tr>
            `;
        }
        return '';
    }).join('');

    document.getElementById('absensiGuruPage').innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4">Absensi Kehadiran Guru</h3>
            <div class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md">
                <p class="font-bold">Status Hari Ini (${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })})</p>
                <p id="statusAbsenGuru">${statusText}</p>
            </div>
            <div class="flex space-x-4 mb-8">
                <button onclick="handleAbsen('masuk')" id="tombolAbsenMasuk" class="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" ${tombolMasukDisabled}>
                    <i class="fas fa-sign-in-alt mr-2"></i> Absen Masuk
                </button>
                <button onclick="handleAbsen('pulang')" id="tombolAbsenPulang" class="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" ${tombolPulangDisabled}>
                    <i class="fas fa-sign-out-alt mr-2"></i> Absen Pulang
                </button>
            </div>
            
            <h3 class="text-xl font-bold mb-4">Riwayat Absensi Anda</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3">Tanggal</th>
                            <th class="p-3 text-center">Jam Masuk</th>
                            <th class="p-3 text-center">Jam Pulang</th>
                            <th class="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>${historyRows || '<tr><td colspan="4" class="text-center p-4 text-gray-500">Belum ada riwayat absensi.</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
}

function handleAbsen(tipe) {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const nip = Object.keys(mockUsers).find(key => mockUsers[key] === currentUser);

    if (!mockAbsensiGuru[today]) {
        mockAbsensiGuru[today] = {};
    }
    if (!mockAbsensiGuru[today][nip]) {
        mockAbsensiGuru[today][nip] = { masuk: null, pulang: null, status: null };
    }

    if (tipe === 'masuk' && !mockAbsensiGuru[today][nip].masuk) {
        mockAbsensiGuru[today][nip].masuk = timeString;
        mockAbsensiGuru[today][nip].status = 'Hadir';
        showSuccessToast('Berhasil melakukan absen masuk!');
    } else if (tipe === 'pulang' && mockAbsensiGuru[today][nip].masuk && !mockAbsensiGuru[today][nip].pulang) {
        mockAbsensiGuru[today][nip].pulang = timeString;
        showSuccessToast('Berhasil melakukan absen pulang!');
    }

    renderAbsensiGuru();
}

function renderAbsensiSiswa() {
    const today = new Date().toISOString().slice(0,10);
    let kelasOptions = mockKelas;
// ... existing code ... -->

