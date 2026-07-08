/**
 * GOCES - Halaman Aktivitas Logic
 * Mematuhi aturan strict Vanilla JS: Tidak membuat HTML menggunakan JS.
 * Digunakan untuk: Navigasi Tab, Animasi Kelas, dan Filter Empty State.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Inisialisasi Variabel DOM
    // ==========================================
    const segmentButtons = document.querySelectorAll('.gcsAct-segment-btn');
    const tabContents = document.querySelectorAll('.gcsAct-tab-content');
    const emptyState = document.getElementById('gcsAct-empty');

    // ==========================================
    // 2. Fungsi Pengecekan Data Kosong (Empty State)
    // ==========================================
    /**
     * Memeriksa apakah sebuah tab memiliki Card (article) di dalamnya.
     * Jika tidak ada, tampilkan ilustrasi Empty State.
     */
    const checkEmptyState = (activeTabElement) => {
        // Ambil semua article di dalam tab yang sedang aktif
        const cards = activeTabElement.querySelectorAll('article.gcsAct-card');

        if (cards.length === 0) {
            // Tampilkan empty state
            emptyState.classList.remove('gcsAct-hidden');
        } else {
            // Sembunyikan empty state
            emptyState.classList.add('gcsAct-hidden');
        }
    };

    // ==========================================
    // 3. Logika Navigasi Tab (Switching)
    // ==========================================
    /**
     * Fungsi utama untuk mengelola perpindahan antar kategori.
     * Menggunakan CSS transition (opacity, transform) untuk animasi iOS.
     */
    const switchTab = (targetId) => {
        // Elemen Tab Baru
        const targetTab = document.getElementById(targetId);

        // Cari Tab Lama yang saat ini aktif
        const currentTab = document.querySelector('.gcsAct-tab-content.gcsAct-show');

        // Mencegah proses berulang jika tab yang diklik sudah aktif
        if (currentTab && currentTab.id === targetId) return;

        // Proses Menghilangkan Tab Lama (Fade Out)
        if (currentTab) {
            // Hapus class active (trigger animasi CSS opacity 0 & scale down)
            currentTab.classList.remove('gcsAct-active');

            // Tunggu durasi CSS transition selesai (0.3s)
            setTimeout(() => {
                currentTab.classList.remove('gcsAct-show'); // Hapus display: block

                // Proses Memunculkan Tab Baru (Fade In)
                showNewTab(targetTab);
            }, 300); // Sesuaikan dengan durasi di CSS .gcsAct-tab-content

        } else {
            // Fallback jika tidak ada tab aktif sebelumnya
            showNewTab(targetTab);
        }
    };

    /**
     * Fungsi pembantu untuk memunculkan tab baru secara visual
     */
    const showNewTab = (targetTab) => {
        // 1. Set display: block (agar memakan ruang layout)
        targetTab.classList.add('gcsAct-show');

        // 2. Cek apakah tab ini butuh Empty State
        checkEmptyState(targetTab);

        // 3. Gunakan requestAnimationFrame untuk memastikan browser 
        // merender display:block terlebih dahulu sebelum memicu animasi.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Tambah class active (trigger animasi CSS opacity 1 & scale 1)
                targetTab.classList.add('gcsAct-active');
            });
        });
    };

    // ==========================================
    // 4. Event Listener Segmented Control
    // ==========================================
    segmentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickedBtn = e.currentTarget;
            const targetId = clickedBtn.dataset.target;

            // Reset UI Kategori Aktif
            segmentButtons.forEach(btn => btn.classList.remove('gcsAct-active'));

            // Set tombol yang ditekan menjadi aktif
            clickedBtn.classList.add('gcsAct-active');

            // Eksekusi perpindahan tab
            switchTab(targetId);
        });
    });

    // ==========================================
    // 5. Inisiasi Awal Saat Halaman Dimuat
    // ==========================================
    // Memastikan empty state di-cek pada tab default yang aktif
    const defaultActiveTab = document.querySelector('.gcsAct-tab-content.gcsAct-active');
    if (defaultActiveTab) {
        checkEmptyState(defaultActiveTab);
    }
});