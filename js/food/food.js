document.addEventListener("DOMContentLoaded", () => {
    // 1. Logika Tab / Kategori Filter
    const chips = document.querySelectorAll('.chip');
    const sections = document.querySelectorAll('.category-section');

    // Event Delegation menggunakan forEach (karena jumlah chip sedikit dan statis)
    chips.forEach(chip => {
        chip.addEventListener('click', function (e) {
            e.preventDefault();

            // Ambil target section dari data-target
            const targetId = this.getAttribute('data-target');

            // Jika chip yang diklik sudah aktif, tidak perlu melakukan apa-apa
            if (this.classList.contains('active')) return;

            // Hapus kelas aktif dari semua chip
            chips.forEach(c => c.classList.remove('active'));
            // Tambahkan kelas aktif ke chip yang diklik
            this.classList.add('active');

            // Sembunyikan semua section (hilangkan class active)
            sections.forEach(section => {
                // Untuk memastikan animasi spring/fade ter-trigger ulang
                section.style.display = 'none';
                section.classList.remove('active');
            });

            // Tampilkan section yang dituju
            // Menggunakan requestAnimationFrame agar browser me-render display:block terlebih dahulu
            // sebelum meng-apply class active (untuk trigger CSS Animation)
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        targetSection.classList.add('active');
                    });
                });
            }

            // Scroll otomatis ke chip yang diklik agar terlihat di tengah (berguna di mobile)
            this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // 2. Optimasi Pencarian dengan Debounce (Performance)
    const searchInput = document.getElementById('search');

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const handleSearch = debounce((e) => {
        const query = e.target.value.toLowerCase();
        // Logika pencarian murni di frontend (jika diperlukan)
        // Saat ini hanya sekedar visual, namun siap dipasang logika filter DOM.
        console.log("Mencari: ", query);
    }, 300); // Tunggu 300ms setelah user berhenti mengetik

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});