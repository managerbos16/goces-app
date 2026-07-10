// ===================================================
// PENGATURAN BANNER MAKANAN
// Tambahkan banner baru di bawah ini
// ===================================================
const gcsFoodBannerData = [
    {
        // ===================================================
        // GANTI GAMBAR BANNER
        // ===================================================
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
        // ===================================================
        // GANTI LINK MERCHANT
        // ===================================================
        link: "merchant-food-1.html",
        // ===================================================
        // ATUR TANGGAL MULAI
        // Format: YYYY-MM-DD HH:mm:ss
        // ===================================================
        start: "2026-07-01 00:00:00",
        // ===================================================
        // ATUR TANGGAL BERAKHIR
        // Banner otomatis hilang jika melewati tanggal ini
        // ===================================================
        end: "2026-07-31 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        link: "merchant-food-2.html",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        link: "merchant-food-3.html",
        start: "2026-07-05 00:00:00",
        end: "2026-07-28 23:59:59"
    },
    // ===================================================
    // TAMBAH BANNER BARU
    // Salin object di bawah ini
    // ===================================================
    /*
    {
      image: "images/food4.jpg",
      link: "merchant-food-4.html",
      start: "2026-07-10 00:00:00",
      end: "2026-07-20 23:59:59"
    }
    */
];

// --- VARIABEL KONTROL INTERNAL KOMPONEN FOOD ---
let gcsFoodBannerCurrentIndex = 0;
let gcsFoodBannerActiveItems = [];
let gcsFoodBannerTimer = null;
let gcsFoodBannerTouchStartX = 0;
let gcsFoodBannerTouchEndX = 0;

// Menjalankan komponen secara aman setelah struktur DOM siap
document.addEventListener("DOMContentLoaded", () => {
    gcsFoodBannerInit();
});

/**
 * Menginisialisasi workflow filter jadwal dan render visual komponen
 */
function gcsFoodBannerInit() {
    // Jalankan sistem pengecekan waktu berjalannya durasi promo makanan
    gcsFoodBannerActiveItems = gcsFoodBannerCheckSchedule(gcsFoodBannerData);

    // Tampilkan data hasil saringan sistem ke layout
    gcsFoodBannerRender(gcsFoodBannerActiveItems);
}

/**
 * Menyaring item banner yang berhak tayang berdasarkan waktu nyata perangkat pengguna
 * @param {Array} bannerList - Data konfigurasi master banner makanan
 * @returns {Array} - List data banner makanan lolos validasi
 */
function gcsFoodBannerCheckSchedule(bannerList) {
    const gcsFoodBannerNow = new Date().getTime();

    return bannerList.filter(item => {
        // Normalisasi string tanggal agar kompatibel lintas browser engine (iOS Safari/Android Chrome)
        const gcsFoodBannerStartTime = new Date(item.start.replace(/-/g, "/")).getTime();
        const gcsFoodBannerEndTime = new Date(item.end.replace(/-/g, "/")).getTime();

        // Kondisi mutlak: start <= sekarang <= end
        return gcsFoodBannerNow >= gcsFoodBannerStartTime && gcsFoodBannerNow <= gcsFoodBannerEndTime;
    });
}

/**
 * Memproduksi markup DOM elemen secara otomatis (Auto-Generate)
 * @param {Array} activeBanners - Array kumpulan banner makanan yang aktif
 */
function gcsFoodBannerRender(activeBanners) {
    const gcsFoodBannerMainWrapper = document.getElementById("gcsFoodBannerContainer");
    if (!gcsFoodBannerMainWrapper) return;

    // JIKA TIDAK ADA BANNER AKTIF: Sembunyikan Judul & Lakukan Frame Otomatis Kosong (Kolaps Total)
    if (activeBanners.length === 0) {
        gcsFoodBannerMainWrapper.classList.add("gcsFoodBannerCollapse");
        gcsFoodBannerMainWrapper.innerHTML = "";
        return;
    }

    // Bersihkan kelas kolaps jika terdeteksi ada promo yang aktif kembali
    gcsFoodBannerMainWrapper.classList.remove("gcsFoodBannerCollapse");

    // Konstruksi Judul "Promo Makanan" Secara Otomatis
    const gcsFoodBannerHeaderNode = document.createElement("div");
    gcsFoodBannerHeaderNode.classList.add("gcsFoodBannerHeader");

    const gcsFoodBannerTitleNode = document.createElement("h2");
    gcsFoodBannerTitleNode.classList.add("gcsFoodBannerTitle");
    gcsFoodBannerTitleNode.textContent = "Promo Makanan";
    gcsFoodBannerHeaderNode.appendChild(gcsFoodBannerTitleNode);
    gcsFoodBannerMainWrapper.appendChild(gcsFoodBannerHeaderNode);

    // Konstruksi Frame Slider Viewport Utama
    const gcsFoodBannerSliderNode = document.createElement("div");
    gcsFoodBannerSliderNode.classList.add("gcsFoodBannerSlider");

    // Konstruksi Track Geser Horizontal
    const gcsFoodBannerTrackNode = document.createElement("div");
    gcsFoodBannerTrackNode.classList.add("gcsFoodBannerTrack");
    gcsFoodBannerTrackNode.id = "gcsFoodBannerTrackEl";

    // Iterasi pembentukan struktur item banner (<a href> dan <img>)
    activeBanners.forEach(banner => {
        const gcsFoodBannerItemNode = document.createElement("div");
        gcsFoodBannerItemNode.classList.add("gcsFoodBannerItem");

        const gcsFoodBannerAnchorNode = document.createElement("a");
        gcsFoodBannerAnchorNode.classList.add("gcsFoodBannerLink");
        gcsFoodBannerAnchorNode.setAttribute("href", banner.link);

        const gcsFoodBannerImgNode = document.createElement("img");
        gcsFoodBannerImgNode.classList.add("gcsFoodBannerImage");
        gcsFoodBannerImgNode.setAttribute("src", banner.image);
        gcsFoodBannerImgNode.setAttribute("alt", "GOCES Food Promo");
        gcsFoodBannerImgNode.setAttribute("loading", "lazy");

        gcsFoodBannerAnchorNode.appendChild(gcsFoodBannerImgNode);
        gcsFoodBannerItemNode.appendChild(gcsFoodBannerAnchorNode);
        gcsFoodBannerTrackNode.appendChild(gcsFoodBannerItemNode);
    });

    gcsFoodBannerSliderNode.appendChild(gcsFoodBannerTrackNode);
    gcsFoodBannerMainWrapper.appendChild(gcsFoodBannerSliderNode);

    // Jalankan logika pembentukan Dot Indikator Navigasi
    gcsFoodBannerCreateDots(activeBanners.length, gcsFoodBannerMainWrapper);

    // Aktifkan interaksi tambahan jika kuantitas banner lebih dari 1 item
    if (activeBanners.length > 1) {
        gcsFoodBannerAutoSlide();
        gcsFoodBannerSwipe(gcsFoodBannerSliderNode);
    }
}

/**
 * Membuat dan mengatur aturan visibilitas Dot Indicator berdasarkan kuantitas banner aktif
 * @param {number} totalActiveBanners - Total banner makanan yang aktif saat ini
 * @param {HTMLElement} parentWrapper - Node kontainer tempat menempelkan dot
 */
function gcsFoodBannerCreateDots(totalActiveBanners, parentWrapper) {
    const gcsFoodBannerDotsContainer = document.createElement("div");
    gcsFoodBannerDotsContainer.classList.add("gcsFoodBannerDots");
    gcsFoodBannerDotsContainer.id = "gcsFoodBannerDotsContainerEl";

    // ATURAN VISIBILITAS DOT INDICATOR:
    // Sembunyikan dot jika banner hanya berjumlah 1 ATAU berjumlah di atas 5 item aktif.
    if (totalActiveBanners === 1 || totalActiveBanners > 5) {
        gcsFoodBannerDotsContainer.classList.add("gcsFoodBannerHidden");
    }

    // Generate jumlah titik navigasi lingkaran kecil
    for (let i = 0; i < totalActiveBanners; i++) {
        const gcsFoodBannerDotNode = document.createElement("span");
        gcsFoodBannerDotNode.classList.add("gcsFoodBannerDot");
        if (i === 0) {
            gcsFoodBannerDotNode.classList.add("gcsFoodBannerActive");
        }
        gcsFoodBannerDotsContainer.appendChild(gcsFoodBannerDotNode);
    }

    parentWrapper.appendChild(gcsFoodBannerDotsContainer);
}

/**
 * Melakukan perpindahan halaman koordinat slide berdasarkan sumbu X
 * @param {number} indexTarget - Indeks halaman sasaran dituju
 */
function gcsFoodBannerGoToSlide(indexTarget) {
    const gcsFoodBannerTrackEl = document.getElementById("gcsFoodBannerTrackEl");
    const gcsFoodBannerDotsContainerEl = document.getElementById("gcsFoodBannerDotsContainerEl");

    if (!gcsFoodBannerTrackEl) return;

    gcsFoodBannerCurrentIndex = indexTarget;

    // Menggeser track menggunakan keunggulan akselerasi hardware CSS Transform
    gcsFoodBannerTrackEl.style.transform = `translateX(-${gcsFoodBannerCurrentIndex * 100}%)`;

    // Perbarui indikasi status titik aktif apabila dot tidak tersembunyi
    if (gcsFoodBannerDotsContainerEl && !gcsFoodBannerDotsContainerEl.classList.contains("gcsFoodBannerHidden")) {
        const gcsFoodBannerDotCollection = gcsFoodBannerDotsContainerEl.querySelectorAll(".gcsFoodBannerDot");
        gcsFoodBannerDotCollection.forEach((dot, index) => {
            if (index === gcsFoodBannerCurrentIndex) {
                dot.classList.add("gcsFoodBannerActive");
            } else {
                dot.classList.remove("gcsFoodBannerActive");
            }
        });
    }
}

/**
 * Memulai putaran rotasi pemindahan halaman otomatis berkala (Auto Slide 4000ms)
 */
function gcsFoodBannerAutoSlide() {
    gcsFoodBannerTimer = setInterval(() => {
        let nextIndex = gcsFoodBannerCurrentIndex + 1;
        if (nextIndex >= gcsFoodBannerActiveItems.length) {
            nextIndex = 0; // Kembalikan siklus ke index awal jika mencapai ujung banner
        }
        gcsFoodBannerGoToSlide(nextIndex);
    }, 4000);
}

/**
 * Mengaktifkan fungsionalitas penangkapan usapan jari layar sentuh (Touch Support Mobile)
 * @param {HTMLElement} sliderElement - Elemen sensitif penangkap event touch
 */
function gcsFoodBannerSwipe(sliderElement) {
    // Tangkap koordinat awal sentuhan
    sliderElement.addEventListener("touchstart", (e) => {
        gcsFoodBannerTouchStartX = e.changedTouches[0].screenX;
        clearInterval(gcsFoodBannerTimer); // Matikan timer transisi otomatis agar tidak bentrok
    }, { passive: true });

    // Tangkap koordinat lepasnya sentuhan jari
    sliderElement.addEventListener("touchend", (e) => {
        gcsFoodBannerTouchEndX = e.changedTouches[0].screenX;
        gcsFoodBannerHandleSwipeGesture();

        // Jalankan kembali timer rotasi otomatis berkala setelah dilepas
        clearInterval(gcsFoodBannerTimer);
        gcsFoodBannerAutoSlide();
    }, { passive: true });
}

/**
 * Menghitung selisih jarak usap untuk menentukan keabsahan arah gerak geser halaman
 */
function gcsFoodBannerHandleSwipeGesture() {
    const gcsFoodBannerSwipeThreshold = 45; // Nilai ambang batas minimal pergeseran dalam satuan piksel

    // Deteksi Swipe Ke Kiri (Menampilkan Item Sesudahnya)
    if (gcsFoodBannerTouchStartX - gcsFoodBannerTouchEndX > gcsFoodBannerSwipeThreshold) {
        if (gcsFoodBannerCurrentIndex < gcsFoodBannerActiveItems.length - 1) {
            gcsFoodBannerGoToSlide(gcsFoodBannerCurrentIndex + 1);
        } else {
            gcsFoodBannerGoToSlide(0);
        }
    }

    // Deteksi Swipe Ke Kanan (Menampilkan Item Sebelumnya)
    if (gcsFoodBannerTouchEndX - gcsFoodBannerTouchStartX > gcsFoodBannerSwipeThreshold) {
        if (gcsFoodBannerCurrentIndex > 0) {
            gcsFoodBannerGoToSlide(gcsFoodBannerCurrentIndex - 1);
        } else {
            gcsFoodBannerGoToSlide(gcsFoodBannerActiveItems.length - 1);
        }
    }
}