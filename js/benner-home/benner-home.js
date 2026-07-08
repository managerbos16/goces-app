// ===================================================
// PENGATURAN BANNER GOCES
// ===================================================

// ===================================================
// TAMBAH BANNER BARU
// Salin atau tambahkan object baru di dalam array ini.
// Pastikan format penulisan properti valid.
// ===================================================
const gcsPromoBannerData = [
    {
        // ===================================================
        // GANTI GAMBAR BANNER (Skenario: Aktif)
        // ===================================================
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
        // ===================================================
        // ATUR LINK BANNER
        // ===================================================
        link: "promo-gajian.html",
        // ===================================================
        // ATUR TANGGAL MULAI & BERAKHIR PROMO
        // Format: YYYY-MM-DD HH:mm:ss
        // ===================================================
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        link: "promo-sneakers.html",
        start: "2026-07-05 00:00:00",
        end: "2026-07-25 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        link: "promo-audio.html",
        start: "2026-07-08 00:00:00",
        end: "2026-07-15 23:59:59"
    },
    {
        // Contoh Banner Kadaluarsa (Otomatis Tidak Muncul di Layout)
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        link: "promo-jam-tangan.html",
        start: "2026-05-01 00:00:00",
        end: "2026-05-30 23:59:59"
    }
];

// --- VARIABEL KONTROL INTERNAL SLIDER GOCES ---
let gcsPromoBannerCurrentIndex = 0;
let gcsPromoBannerActiveItems = [];
let gcsPromoBannerTimer = null;
let gcsPromoBannerTouchStartX = 0;
let gcsPromoBannerTouchEndX = 0;

// Eksekusi komponen saat DOM selesai dimuat sepenuhnya
document.addEventListener("DOMContentLoaded", () => {
    gcsPromoBannerInit();
});

/**
 * Fungsi Utama Inisialisasi Jalur Alur Komponen Banner Promo
 */
function gcsPromoBannerInit() {
    // 1. Filter data banner berdasarkan validitas waktu
    gcsPromoBannerActiveItems = gcsPromoBannerCheckSchedule(gcsPromoBannerData);

    // 2. Render elemen ke layar
    gcsPromoBannerRender(gcsPromoBannerActiveItems);
}

/**
 * Melakukan validasi pencocokan waktu internal server/client saat ini
 * @param {Array} bannerList - Koleksi array konfigurasi master banner
 * @returns {Array} - Koleksi data banner yang lolos kualifikasi waktu aktif
 */
function gcsPromoBannerCheckSchedule(bannerList) {
    const gcsPromoBannerNow = new Date().getTime();

    return bannerList.filter(item => {
        // Parsing string tanggal "YYYY-MM-DD HH:mm:ss" ke format timestamp browser
        const gcsPromoBannerStartTime = new Date(item.start.replace(/-/g, "/")).getTime();
        const gcsPromoBannerEndTime = new Date(item.end.replace(/-/g, "/")).getTime();

        // Syarat kelayakan tampil: start <= sekarang <= end
        return gcsPromoBannerNow >= gcsPromoBannerStartTime && gcsPromoBannerNow <= gcsPromoBannerEndTime;
    });
}

/**
 * Menyusun komponen visual DOM secara dinamis berdasarkan data terfilter
 * @param {Array} activeBanners - Koleksi data banner aktif
 */
function gcsPromoBannerRender(activeBanners) {
    const gcsPromoBannerMainWrapper = document.getElementById("gcsPromoBannerContainer");
    if (!gcsPromoBannerMainWrapper) return;

    // JIKA TIDAK ADA BANNER AKTIF: Eksekusi Frame Otomatis Kosong (Kolaps Total)
    if (activeBanners.length === 0) {
        gcsPromoBannerMainWrapper.classList.add("gcsPromoBannerCollapse");
        gcsPromoBannerMainWrapper.innerHTML = "";
        return;
    }

    // JIKA ADA BANNER AKTIF: Cabut status kolaps jika sebelumnya sempat terpasang
    gcsPromoBannerMainWrapper.classList.remove("gcsPromoBannerCollapse");

    // Pembuatan Blok Judul Komponen ("Promo Menarik")
    const gcsPromoBannerHeaderNode = document.createElement("div");
    gcsPromoBannerHeaderNode.classList.add("gcsPromoBannerHeader");

    const gcsPromoBannerTitleNode = document.createElement("h2");
    gcsPromoBannerTitleNode.classList.add("gcsPromoBannerTitle");
    gcsPromoBannerTitleNode.textContent = "Promo Menarik";
    gcsPromoBannerHeaderNode.appendChild(gcsPromoBannerTitleNode);
    gcsPromoBannerMainWrapper.appendChild(gcsPromoBannerHeaderNode);

    // Pembuatan Viewport Slider Utama
    const gcsPromoBannerSliderNode = document.createElement("div");
    gcsPromoBannerSliderNode.classList.add("gcsPromoBannerSlider");

    // Pembuatan Flex Track Papan Slide Banner
    const gcsPromoBannerTrackNode = document.createElement("div");
    gcsPromoBannerTrackNode.classList.add("gcsPromoBannerTrack");
    gcsPromoBannerTrackNode.id = "gcsPromoBannerTrackEl";

    // Membangun list item promo secara iteratif
    activeBanners.forEach(banner => {
        const gcsPromoBannerItemNode = document.createElement("div");
        gcsPromoBannerItemNode.classList.add("gcsPromoBannerItem");

        const gcsPromoBannerAnchorNode = document.createElement("a");
        gcsPromoBannerAnchorNode.classList.add("gcsPromoBannerLink");
        gcsPromoBannerAnchorNode.setAttribute("href", banner.link);

        const gcsPromoBannerImgNode = document.createElement("img");
        gcsPromoBannerImgNode.classList.add("gcsPromoBannerImage");
        gcsPromoBannerImgNode.setAttribute("src", banner.image);
        gcsPromoBannerImgNode.setAttribute("alt", "GOCES Promo Banner");
        gcsPromoBannerImgNode.setAttribute("loading", "lazy");

        gcsPromoBannerAnchorNode.appendChild(gcsPromoBannerImgNode);
        gcsPromoBannerItemNode.appendChild(gcsPromoBannerAnchorNode);
        gcsPromoBannerTrackNode.appendChild(gcsPromoBannerItemNode);
    });

    gcsPromoBannerSliderNode.appendChild(gcsPromoBannerTrackNode);
    gcsPromoBannerMainWrapper.appendChild(gcsPromoBannerSliderNode);

    // Pembuatan Sistem Dot Indikator Navigasi
    gcsPromoBannerCreateDots(activeBanners.length, gcsPromoBannerMainWrapper);

    // Mengaktifkan fitur tambahan pendukung interaksi lanjut jika item > 1
    if (activeBanners.length > 1) {
        gcsPromoBannerAutoSlide();
        gcsPromoBannerSwipe(gcsPromoBannerSliderNode);
    }
}

/**
 * Mengelola visibilitas dan pembuatan Dot Indicator secara presisi sesuai instruksi jumlah
 * @param {number} totalActiveBanners - Total item terhitung aktif saat ini
 * @param {HTMLElement} parentWrapper - Node kontainer tempat menempelkan dot
 */
function gcsPromoBannerCreateDots(totalActiveBanners, parentWrapper) {
    const gcsPromoBannerDotsContainer = document.createElement("div");
    gcsPromoBannerDotsContainer.classList.add("gcsPromoBannerDots");
    gcsPromoBannerDotsContainer.id = "gcsPromoBannerDotsContainerEl";

    // ATURAN VALIDASI DOT INDICATOR:
    // Jika aktif hanya 1 ATAU lebih dari 5, dot wajib disembunyikan.
    if (totalActiveBanners === 1 || totalActiveBanners > 5) {
        gcsPromoBannerDotsContainer.classList.add("gcsPromoBannerHidden");
    }

    // Buat titik navigasi bulat secara berulang
    for (let i = 0; i < totalActiveBanners; i++) {
        const gcsPromoBannerDotNode = document.createElement("span");
        gcsPromoBannerDotNode.classList.add("gcsPromoBannerDot");
        if (i === 0) {
            gcsPromoBannerDotNode.classList.add("gcsPromoPromoBannerActive");
        }
        gcsPromoBannerDotsContainer.appendChild(gcsPromoBannerDotNode);
    }

    parentWrapper.appendChild(gcsPromoBannerDotsContainer);
}

/**
 * Memindahkan track geser slider ke indeks banner sasaran secara halus
 * @param {number} indexTarget - Indeks urutan slide tujuan
 */
function gcsPromoBannerGoToSlide(indexTarget) {
    const gcsPromoBannerTrackEl = document.getElementById("gcsPromoBannerTrackEl");
    const gcsPromoBannerDotsContainerEl = document.getElementById("gcsPromoBannerDotsContainerEl");

    if (!gcsPromoBannerTrackEl) return;

    gcsPromoBannerCurrentIndex = indexTarget;

    // Geser posisi track horizontal menggunakan sumbu CSS Transform X%
    gcsPromoBannerTrackEl.style.transform = `translateX(-${gcsPromoBannerCurrentIndex * 100}%)`;

    // Perbarui visualisasi status dot aktif jika komponen dot tidak disembunyikan
    if (gcsPromoBannerDotsContainerEl && !gcsPromoBannerDotsContainerEl.classList.contains("gcsPromoBannerHidden")) {
        const gcsPromoBannerDotCollection = gcsPromoBannerDotsContainerEl.querySelectorAll(".gcsPromoBannerDot");
        gcsPromoBannerDotCollection.forEach((dot, index) => {
            if (index === gcsPromoBannerCurrentIndex) {
                dot.classList.add("gcsPromoPromoBannerActive");
            } else {
                dot.classList.remove("gcsPromoPromoBannerActive");
            }
        });
    }
}

/**
 * Mengatur perputaran interval rotasi berkala otomatis (Auto Slide 4000ms)
 */
function gcsPromoBannerAutoSlide() {
    gcsPromoBannerTimer = setInterval(() => {
        let nextIndex = gcsPromoBannerCurrentIndex + 1;
        if (nextIndex >= gcsPromoBannerActiveItems.length) {
            nextIndex = 0; // Reset berputar kembali ke slide perdana
        }
        gcsPromoBannerGoToSlide(nextIndex);
    }, 4000); // Batas durasi transisi berkala wajib 4000ms
}

/**
 * Menghidupkan pendeteksi gestur usapan layar (Touch Support Swipe Kiri / Kanan) perangkat mobile
 * @param {HTMLElement} sliderElement - Elemen sensitif tangkapan sentuh area slider
 */
function gcsPromoBannerSwipe(sliderElement) {
    // Tangkap koordinat awal jari menyentuh panel banner
    sliderElement.addEventListener("touchstart", (e) => {
        gcsPromoBannerTouchStartX = e.changedTouches[0].screenX;
        clearInterval(gcsPromoBannerTimer); // Amankan transisi otomatis dari bentrokan interaksi manual
    }, { passive: true });

    // Tangkap koordinat akhir saat jari diangkat dari permukaan panel layar
    sliderElement.addEventListener("touchend", (e) => {
        gcsPromoBannerTouchEndX = e.changedTouches[0].screenX;
        gcsPromoBannerHandleSwipeGesture();

        // Hidupkan kembali putaran auto slide setelah interaksi usap manual selesai dilakukan
        clearInterval(gcsPromoBannerTimer);
        gcsPromoBannerAutoSlide();
    }, { passive: true });
}

/**
 * Mengevaluasi kalkulasi jarak geser usapan jari untuk memicu perpindahan halaman slide
 */
function gcsPromoBannerHandleSwipeGesture() {
    const gcsPromoBannerSwipeThreshold = 45; // Batas minimum piksel usapan agar dinilai sebagai aksi valid

    // Kasus Swipe ke Arah Kiri (Membuka Banner Berikutnya)
    if (gcsPromoBannerTouchStartX - gcsPromoBannerTouchEndX > gcsPromoBannerSwipeThreshold) {
        if (gcsPromoBannerCurrentIndex < gcsPromoBannerActiveItems.length - 1) {
            gcsPromoBannerGoToSlide(gcsPromoBannerCurrentIndex + 1);
        } else {
            gcsPromoBannerGoToSlide(0); // Siklus berputar kembali ke awal jika usap di ujung akhir
        }
    }

    // Kasus Swipe ke Arah Kanan (Membuka Banner Sebelumnya)
    if (gcsPromoBannerTouchEndX - gcsPromoBannerTouchStartX > gcsPromoBannerSwipeThreshold) {
        if (gcsPromoBannerCurrentIndex > 0) {
            gcsPromoBannerGoToSlide(gcsPromoBannerCurrentIndex - 1);
        } else {
            gcsPromoBannerGoToSlide(gcsPromoBannerActiveItems.length - 1); // Lompat ke ujung akhir jika usap di ujung awal
        }
    }
}