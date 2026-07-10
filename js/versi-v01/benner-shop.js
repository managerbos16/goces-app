// ===================================================
// PENGATURAN BANNER SHOP
// Tambahkan banner baru di bawah ini
// ===================================================
const gcsShopBannerData = [
    {
        // ===================================================
        // GANTI GAMBAR BANNER SHOP
        // ===================================================
        image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80",
        // ===================================================
        // GANTI LINK SHOP
        // ===================================================
        link: "shop-gadget.html",
        // ===================================================
        // ATUR TANGGAL MULAI PROMO
        // Format: YYYY-MM-DD HH:mm:ss
        // ===================================================
        start: "2026-07-01 00:00:00",
        // ===================================================
        // ATUR TANGGAL BERAKHIR PROMO
        // Banner otomatis hilang setelah melewati tanggal ini
        // ===================================================
        end: "2026-07-31 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        link: "shop-fashion.html",
        start: "2026-07-01 00:00:00",
        end: "2026-07-28 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        link: "shop-shoes.html",
        start: "2026-07-05 00:00:00",
        end: "2026-07-20 23:59:59"
    },
    // ===================================================
    // TAMBAHKAN BANNER SHOP BARU
    // Salin object di bawah ini
    // ===================================================
    /*
    {
      image: "images/shop4.jpg",
      link: "shop-4.html",
      start: "2026-07-10 00:00:00",
      end: "2026-07-25 23:59:59"
    }
    */
];

// --- VARIABEL STATE INTERNAL BANNER SHOP ---
let gcsShopBannerCurrentIndex = 0;
let gcsShopBannerActiveItems = [];
let gcsShopBannerTimer = null;
let gcsShopBannerTouchStartX = 0;
let gcsShopBannerTouchEndX = 0;

// Eksekusi ketika struktur DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    gcsShopBannerInit();
});

/**
 * Fungsi Utama untuk menginisialisasi seluruh proses komponen Shop Banner
 */
function gcsShopBannerInit() {
    gcsShopBannerActiveItems = gcsShopBannerCheckSchedule(gcsShopBannerData);
    gcsShopBannerRender(gcsShopBannerActiveItems);
}

/**
 * Mengecek dan menyaring banner yang masuk dalam rentang tanggal tayang
 * @param {Array} bannerList - Array data mentah banner shop
 * @returns {Array} Array berisi banner yang sedang aktif
 */
function gcsShopBannerCheckSchedule(bannerList) {
    const gcsShopBannerNow = new Date().getTime();

    return bannerList.filter(item => {
        // Normalisasi format '-' menjadi '/' agar aman dieksekusi di engine Safari/iOS
        const gcsShopBannerStartTime = new Date(item.start.replace(/-/g, "/")).getTime();
        const gcsShopBannerEndTime = new Date(item.end.replace(/-/g, "/")).getTime();

        // Perbandingan: start <= sekarang <= end
        return gcsShopBannerNow >= gcsShopBannerStartTime && gcsShopBannerNow <= gcsShopBannerEndTime;
    });
}

/**
 * Mencetak susunan elemen HTML secara dinamis berdasarkan data banner yang aktif
 * @param {Array} activeBanners - Array banner yang valid secara waktu
 */
function gcsShopBannerRender(activeBanners) {
    const gcsShopBannerMainWrapper = document.getElementById("gcsShopBannerContainer");
    if (!gcsShopBannerMainWrapper) return;

    // AUTO FRAME: Jika kosong, bersihkan semua isi dan matikan ukuran kontainer
    if (activeBanners.length === 0) {
        gcsShopBannerMainWrapper.classList.add("gcsShopBannerCollapse");
        gcsShopBannerMainWrapper.innerHTML = "";
        return;
    }

    // Jika ada promo, pastikan kontainer tidak dalam status kolaps
    gcsShopBannerMainWrapper.classList.remove("gcsShopBannerCollapse");

    // Generate Elemen Judul (Otomatis muncul karena ada banner aktif)
    const gcsShopBannerHeaderNode = document.createElement("div");
    gcsShopBannerHeaderNode.classList.add("gcsShopBannerHeader");

    const gcsShopBannerTitleNode = document.createElement("h2");
    gcsShopBannerTitleNode.classList.add("gcsShopBannerTitle");
    gcsShopBannerTitleNode.textContent = "Promo Shop";
    gcsShopBannerHeaderNode.appendChild(gcsShopBannerTitleNode);
    gcsShopBannerMainWrapper.appendChild(gcsShopBannerHeaderNode);

    // Generate Container Slider Utama
    const gcsShopBannerSliderNode = document.createElement("div");
    gcsShopBannerSliderNode.classList.add("gcsShopBannerSlider");

    // Generate Track Geser
    const gcsShopBannerTrackNode = document.createElement("div");
    gcsShopBannerTrackNode.classList.add("gcsShopBannerTrack");
    gcsShopBannerTrackNode.id = "gcsShopBannerTrackEl";

    // Membangun daftar item banner secara berulang
    activeBanners.forEach(banner => {
        const gcsShopBannerItemNode = document.createElement("div");
        gcsShopBannerItemNode.classList.add("gcsShopBannerItem");

        const gcsShopBannerAnchorNode = document.createElement("a");
        gcsShopBannerAnchorNode.classList.add("gcsShopBannerLink");
        gcsShopBannerAnchorNode.setAttribute("href", banner.link);

        const gcsShopBannerImgNode = document.createElement("img");
        gcsShopBannerImgNode.classList.add("gcsShopBannerImage");
        gcsShopBannerImgNode.setAttribute("src", banner.image);
        gcsShopBannerImgNode.setAttribute("alt", "Promo Shop GOCES");
        gcsShopBannerImgNode.setAttribute("loading", "lazy");

        gcsShopBannerAnchorNode.appendChild(gcsShopBannerImgNode);
        gcsShopBannerItemNode.appendChild(gcsShopBannerAnchorNode);
        gcsShopBannerTrackNode.appendChild(gcsShopBannerItemNode);
    });

    gcsShopBannerSliderNode.appendChild(gcsShopBannerTrackNode);
    gcsShopBannerMainWrapper.appendChild(gcsShopBannerSliderNode);

    // Memicu logika pembuatan Dot Indicator
    gcsShopBannerCreateDots(activeBanners.length, gcsShopBannerMainWrapper);

    // Fitur interaksi hanya berjalan jika banner > 1
    if (activeBanners.length > 1) {
        gcsShopBannerAutoSlide();
        gcsShopBannerSwipe(gcsShopBannerSliderNode);
    }
}

/**
 * Mencetak titik navigasi dengan aturan kalkulasi visibilitas yang ketat
 * @param {number} totalActiveBanners - Total item tayang
 * @param {HTMLElement} parentWrapper - Node tempat dot akan diinjeksi
 */
function gcsShopBannerCreateDots(totalActiveBanners, parentWrapper) {
    const gcsShopBannerDotsContainer = document.createElement("div");
    gcsShopBannerDotsContainer.classList.add("gcsShopBannerDots");
    gcsShopBannerDotsContainer.id = "gcsShopBannerDotsContainerEl";

    // ATURAN VISIBILITAS:
    // Disembunyikan jika banner berjumlah 1, atau lebih besar dari 5.
    if (totalActiveBanners === 1 || totalActiveBanners > 5) {
        gcsShopBannerDotsContainer.classList.add("gcsShopBannerHidden");
    }

    // Buat titik navigasi sebanyak banner aktif
    for (let i = 0; i < totalActiveBanners; i++) {
        const gcsShopBannerDotNode = document.createElement("span");
        gcsShopBannerDotNode.classList.add("gcsShopBannerDot");
        if (i === 0) {
            gcsShopBannerDotNode.classList.add("gcsShopBannerActive");
        }
        gcsShopBannerDotsContainer.appendChild(gcsShopBannerDotNode);
    }

    parentWrapper.appendChild(gcsShopBannerDotsContainer);
}

/**
 * Memindahkan slide dengan CSS Transform secara halus
 * @param {number} indexTarget - Nomor urut slide yang dituju
 */
function gcsShopBannerGoToSlide(indexTarget) {
    const gcsShopBannerTrackEl = document.getElementById("gcsShopBannerTrackEl");
    const gcsShopBannerDotsContainerEl = document.getElementById("gcsShopBannerDotsContainerEl");

    if (!gcsShopBannerTrackEl) return;

    gcsShopBannerCurrentIndex = indexTarget;
    gcsShopBannerTrackEl.style.transform = `translateX(-${gcsShopBannerCurrentIndex * 100}%)`;

    // Sinkronisasi status titik warna
    if (gcsShopBannerDotsContainerEl && !gcsShopBannerDotsContainerEl.classList.contains("gcsShopBannerHidden")) {
        const gcsShopBannerDotCollection = gcsShopBannerDotsContainerEl.querySelectorAll(".gcsShopBannerDot");
        gcsShopBannerDotCollection.forEach((dot, index) => {
            if (index === gcsShopBannerCurrentIndex) {
                dot.classList.add("gcsShopBannerActive");
            } else {
                dot.classList.remove("gcsShopBannerActive");
            }
        });
    }
}

/**
 * Trigger perpindahan ke slide berikutnya
 */
function gcsShopBannerNext() {
    if (gcsShopBannerCurrentIndex < gcsShopBannerActiveItems.length - 1) {
        gcsShopBannerGoToSlide(gcsShopBannerCurrentIndex + 1);
    } else {
        gcsShopBannerGoToSlide(0); // Kembali ke slide awal
    }
}

/**
 * Trigger perpindahan ke slide sebelumnya
 */
function gcsShopBannerPrevious() {
    if (gcsShopBannerCurrentIndex > 0) {
        gcsShopBannerGoToSlide(gcsShopBannerCurrentIndex - 1);
    } else {
        gcsShopBannerGoToSlide(gcsShopBannerActiveItems.length - 1); // Lompat ke slide terakhir
    }
}

/**
 * Mengatur pergeseran otomatis setiap 4000ms
 */
function gcsShopBannerAutoSlide() {
    gcsShopBannerTimer = setInterval(() => {
        gcsShopBannerNext();
    }, 4000);
}

/**
 * Menambahkan event listener untuk gesture layar sentuh
 * @param {HTMLElement} sliderElement - Elemen area tangkapan usap
 */
function gcsShopBannerSwipe(sliderElement) {
    sliderElement.addEventListener("touchstart", (e) => {
        gcsShopBannerTouchStartX = e.changedTouches[0].screenX;
        clearInterval(gcsShopBannerTimer); // Jeda autoplay saat pengguna menyentuh banner
    }, { passive: true });

    sliderElement.addEventListener("touchend", (e) => {
        gcsShopBannerTouchEndX = e.changedTouches[0].screenX;
        gcsShopBannerHandleSwipeGesture();

        // Mulai kembali autoplay
        clearInterval(gcsShopBannerTimer);
        gcsShopBannerAutoSlide();
    }, { passive: true });
}

/**
 * Mengalkulasi pergerakan sentuhan untuk memicu pergantian slide
 */
function gcsShopBannerHandleSwipeGesture() {
    const gcsShopBannerSwipeThreshold = 45; // Jarak usapan minimum agar diakui sebagai swipe

    // Deteksi usapan layar ke arah Kiri
    if (gcsShopBannerTouchStartX - gcsShopBannerTouchEndX > gcsShopBannerSwipeThreshold) {
        gcsShopBannerNext();
    }

    // Deteksi usapan layar ke arah Kanan
    if (gcsShopBannerTouchEndX - gcsShopBannerTouchStartX > gcsShopBannerSwipeThreshold) {
        gcsShopBannerPrevious();
    }
}