// ===================================================
// PENGATURAN BANNER PPOB
// Tambahkan banner baru di bawah ini
// ===================================================
const gcsPpobBannerData = [
    {
        // ===================================================
        // GANTI GAMBAR BANNER
        // ===================================================
        image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80",
        // ===================================================
        // GANTI LINK HALAMAN
        // ===================================================
        link: "pulsa-data.html",
        // ===================================================
        // ATUR TANGGAL MULAI PROMO
        // Format:
        // YYYY-MM-DD HH:mm:ss
        // ===================================================
        start: "2026-07-01 00:00:00",
        // ===================================================
        // ATUR TANGGAL BERAKHIR PROMO
        // Banner otomatis hilang setelah melewati tanggal ini
        // ===================================================
        end: "2026-07-31 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
        link: "token-pln.html",
        start: "2026-07-01 00:00:00",
        end: "2026-07-28 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
        link: "bpjs-kesehatan.html",
        start: "2026-07-05 00:00:00",
        end: "2026-07-20 23:59:59"
    },
    // ===================================================
    // TAMBAHKAN BANNER PPOB BARU
    // Salin object di bawah ini
    // ===================================================
    /*
    {
      image: "images/ppob-baru.jpg",
      link: "pdam-internet.html",
      start: "2026-07-10 00:00:00",
      end: "2026-07-25 23:59:59"
    }
    */
];

// --- PENYIMPANAN STATE INTERNAL KOMPONEN PPOB ---
let gcsPpobBannerCurrentIndex = 0;
let gcsPpobBannerActiveItems = [];
let gcsPpobBannerTimer = null;
let gcsPpobBannerTouchStartX = 0;
let gcsPpobBannerTouchEndX = 0;

// Menjalankan inisialisasi saat kerangka HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    gcsPpobBannerInit();
});

/**
 * Fungsi Utama untuk menyaring jadwal tayang dan merender UI
 */
function gcsPpobBannerInit() {
    gcsPpobBannerActiveItems = gcsPpobBannerCheckSchedule(gcsPpobBannerData);
    gcsPpobBannerRender(gcsPpobBannerActiveItems);
}

/**
 * Melakukan seleksi banner yang valid berdasarkan tanggal & waktu tayang
 * @param {Array} bannerList - Data array kumpulan banner
 * @returns {Array} List banner yang berhak tayang
 */
function gcsPpobBannerCheckSchedule(bannerList) {
    const gcsPpobBannerNow = new Date().getTime();

    return bannerList.filter(item => {
        // Normalisasi '-' menjadi '/' agar fungsi Date() stabil di browser iOS/Safari
        const gcsPpobBannerStartTime = new Date(item.start.replace(/-/g, "/")).getTime();
        const gcsPpobBannerEndTime = new Date(item.end.replace(/-/g, "/")).getTime();

        // Syarat tayang: Waktu mulai <= Waktu sekarang <= Waktu berakhir
        return gcsPpobBannerNow >= gcsPpobBannerStartTime && gcsPpobBannerNow <= gcsPpobBannerEndTime;
    });
}

/**
 * Membangun elemen HTML dinamis berdasarkan daftar banner yang sedang aktif
 * @param {Array} activeBanners - Array data banner aktif
 */
function gcsPpobBannerRender(activeBanners) {
    const gcsPpobBannerMainWrapper = document.getElementById("gcsPpobBannerContainer");
    if (!gcsPpobBannerMainWrapper) return;

    // AUTO FRAME COLLAPSE: Sembunyikan dan jadikan tinggi 0 jika tidak ada promo aktif
    if (activeBanners.length === 0) {
        gcsPpobBannerMainWrapper.classList.add("gcsPpobBannerCollapse");
        gcsPpobBannerMainWrapper.innerHTML = "";
        return;
    }

    // Tarik kelas collapse jika jadwal promo kembali ada yang aktif
    gcsPpobBannerMainWrapper.classList.remove("gcsPpobBannerCollapse");

    // Pembuatan DOM Judul "Promo PPOB"
    const gcsPpobBannerHeaderNode = document.createElement("div");
    gcsPpobBannerHeaderNode.classList.add("gcsPpobBannerHeader");

    const gcsPpobBannerTitleNode = document.createElement("h2");
    gcsPpobBannerTitleNode.classList.add("gcsPpobBannerTitle");
    gcsPpobBannerTitleNode.textContent = "Promo PPOB";
    gcsPpobBannerHeaderNode.appendChild(gcsPpobBannerTitleNode);
    gcsPpobBannerMainWrapper.appendChild(gcsPpobBannerHeaderNode);

    // Pembuatan DOM Slider Container Utama
    const gcsPpobBannerSliderNode = document.createElement("div");
    gcsPpobBannerSliderNode.classList.add("gcsPpobBannerSlider");

    // Pembuatan DOM Track (Wadah Geser)
    const gcsPpobBannerTrackNode = document.createElement("div");
    gcsPpobBannerTrackNode.classList.add("gcsPpobBannerTrack");
    gcsPpobBannerTrackNode.id = "gcsPpobBannerTrackEl";

    // Looping untuk merangkai Item, Anchor Link, dan Gambar
    activeBanners.forEach(banner => {
        const gcsPpobBannerItemNode = document.createElement("div");
        gcsPpobBannerItemNode.classList.add("gcsPpobBannerItem");

        const gcsPpobBannerAnchorNode = document.createElement("a");
        gcsPpobBannerAnchorNode.classList.add("gcsPpobBannerLink");
        gcsPpobBannerAnchorNode.setAttribute("href", banner.link);

        const gcsPpobBannerImgNode = document.createElement("img");
        gcsPpobBannerImgNode.classList.add("gcsPpobBannerImage");
        gcsPpobBannerImgNode.setAttribute("src", banner.image);
        gcsPpobBannerImgNode.setAttribute("alt", "Promo PPOB GOCES");
        gcsPpobBannerImgNode.setAttribute("loading", "lazy");

        gcsPpobBannerAnchorNode.appendChild(gcsPpobBannerImgNode);
        gcsPpobBannerItemNode.appendChild(gcsPpobBannerAnchorNode);
        gcsPpobBannerTrackNode.appendChild(gcsPpobBannerItemNode);
    });

    gcsPpobBannerSliderNode.appendChild(gcsPpobBannerTrackNode);
    gcsPpobBannerMainWrapper.appendChild(gcsPpobBannerSliderNode);

    // Panggil fungsi generasi Dot Indicator
    gcsPpobBannerCreateDots(activeBanners.length, gcsPpobBannerMainWrapper);

    // Jika banner > 1, hidupkan fungsionalitas auto-slide dan swipe gesture
    if (activeBanners.length > 1) {
        gcsPpobBannerAutoSlide();
        gcsPpobBannerSwipe(gcsPpobBannerSliderNode);
    }
}

/**
 * Mengkalkulasi dan mencetak dot indikator sesuai aturan batas visibilitas
 * @param {number} totalActiveBanners - Total banner yang tampil
 * @param {HTMLElement} parentWrapper - Node lokasi peletakan dot
 */
function gcsPpobBannerCreateDots(totalActiveBanners, parentWrapper) {
    const gcsPpobBannerDotsContainer = document.createElement("div");
    gcsPpobBannerDotsContainer.classList.add("gcsPpobBannerDots");
    gcsPpobBannerDotsContainer.id = "gcsPpobBannerDotsContainerEl";

    // ATURAN PEMBATAS: Dot disembunyikan jika banner hanya 1, atau lebih dari 5
    if (totalActiveBanners === 1 || totalActiveBanners > 5) {
        gcsPpobBannerDotsContainer.classList.add("gcsPpobBannerHidden");
    }

    // Cetak elemen titik indikator
    for (let i = 0; i < totalActiveBanners; i++) {
        const gcsPpobBannerDotNode = document.createElement("span");
        gcsPpobBannerDotNode.classList.add("gcsPpobBannerDot");
        if (i === 0) {
            gcsPpobBannerDotNode.classList.add("gcsPpobBannerActive");
        }
        gcsPpobBannerDotsContainer.appendChild(gcsPpobBannerDotNode);
    }

    parentWrapper.appendChild(gcsPpobBannerDotsContainer);
}

/**
 * Melakukan pergeseran CSS Transform antar slide
 * @param {number} indexTarget - Indeks array slide sasaran
 */
function gcsPpobBannerGoToSlide(indexTarget) {
    const gcsPpobBannerTrackEl = document.getElementById("gcsPpobBannerTrackEl");
    const gcsPpobBannerDotsContainerEl = document.getElementById("gcsPpobBannerDotsContainerEl");

    if (!gcsPpobBannerTrackEl) return;

    gcsPpobBannerCurrentIndex = indexTarget;
    gcsPpobBannerTrackEl.style.transform = `translateX(-${gcsPpobBannerCurrentIndex * 100}%)`;

    // Pembaruan UI untuk merubah warna dot yang aktif (jika dot tidak tersembunyi)
    if (gcsPpobBannerDotsContainerEl && !gcsPpobBannerDotsContainerEl.classList.contains("gcsPpobBannerHidden")) {
        const gcsPpobBannerDotCollection = gcsPpobBannerDotsContainerEl.querySelectorAll(".gcsPpobBannerDot");
        gcsPpobBannerDotCollection.forEach((dot, index) => {
            if (index === gcsPpobBannerCurrentIndex) {
                dot.classList.add("gcsPpobBannerActive");
            } else {
                dot.classList.remove("gcsPpobBannerActive");
            }
        });
    }
}

/**
 * Manuver pindah ke slide berikutnya
 */
function gcsPpobBannerNext() {
    if (gcsPpobBannerCurrentIndex < gcsPpobBannerActiveItems.length - 1) {
        gcsPpobBannerGoToSlide(gcsPpobBannerCurrentIndex + 1);
    } else {
        gcsPpobBannerGoToSlide(0); // Siklus berulang ke posisi awal
    }
}

/**
 * Manuver mundur ke slide sebelumnya
 */
function gcsPpobBannerPrevious() {
    if (gcsPpobBannerCurrentIndex > 0) {
        gcsPpobBannerGoToSlide(gcsPpobBannerCurrentIndex - 1);
    } else {
        gcsPpobBannerGoToSlide(gcsPpobBannerActiveItems.length - 1); // Melompat ke slide ujung akhir
    }
}

/**
 * Transisi berputar otomatis dengan interval 4000ms
 */
function gcsPpobBannerAutoSlide() {
    gcsPpobBannerTimer = setInterval(() => {
        gcsPpobBannerNext();
    }, 4000);
}

/**
 * Menangkap event sentuhan pada layar smartphone untuk interaksi swipe manual
 * @param {HTMLElement} sliderElement - Area kontainer pendeteksi usapan
 */
function gcsPpobBannerSwipe(sliderElement) {
    sliderElement.addEventListener("touchstart", (e) => {
        gcsPpobBannerTouchStartX = e.changedTouches[0].screenX;
        clearInterval(gcsPpobBannerTimer); // Jeda sistem auto-slide saat ditahan jari
    }, { passive: true });

    sliderElement.addEventListener("touchend", (e) => {
        gcsPpobBannerTouchEndX = e.changedTouches[0].screenX;
        gcsPpobBannerHandleSwipeGesture();

        // Nyalakan kembali interval auto-slide saat jari lepas
        clearInterval(gcsPpobBannerTimer);
        gcsPpobBannerAutoSlide();
    }, { passive: true });
}

/**
 * Logika evaluasi arah usapan layar (Kiri / Kanan)
 */
function gcsPpobBannerHandleSwipeGesture() {
    const gcsPpobBannerSwipeThreshold = 45; // Titik piksel usapan minimum agar diakui sebagai Swipe

    // Deteksi Usap Kiri (Maju)
    if (gcsPpobBannerTouchStartX - gcsPpobBannerTouchEndX > gcsPpobBannerSwipeThreshold) {
        gcsPpobBannerNext();
    }

    // Deteksi Usap Kanan (Mundur)
    if (gcsPpobBannerTouchEndX - gcsPpobBannerTouchStartX > gcsPpobBannerSwipeThreshold) {
        gcsPpobBannerPrevious();
    }
}