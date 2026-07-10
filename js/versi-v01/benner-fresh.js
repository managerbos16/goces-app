// ===================================================
// PENGATURAN BANNER FRESH
// Tambahkan banner baru di bawah ini
// ===================================================
const gcsFreshBannerData = [
    {
        // ===================================================
        // GANTI GAMBAR BANNER
        // ===================================================
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
        // ===================================================
        // GANTI LINK HALAMAN
        // ===================================================
        link: "fresh-buah-segar.html",
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
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        link: "fresh-sayur-organik.html",
        start: "2026-07-01 00:00:00",
        end: "2026-07-28 23:59:59"
    },
    {
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bd682f?auto=format&fit=crop&w=800&q=80",
        link: "fresh-daging-pilihan.html",
        start: "2026-07-05 00:00:00",
        end: "2026-07-20 23:59:59"
    },
    // ===================================================
    // TAMBAHKAN BANNER FRESH BARU
    // Salin object di bawah ini
    // ===================================================
    /*
    {
      image: "images/fresh-baru.jpg",
      link: "fresh-promo-baru.html",
      start: "2026-07-10 00:00:00",
      end: "2026-07-25 23:59:59"
    }
    */
];

// --- PENYIMPANAN STATE INTERNAL KOMPONEN ---
let gcsFreshBannerCurrentIndex = 0;
let gcsFreshBannerActiveItems = [];
let gcsFreshBannerTimer = null;
let gcsFreshBannerTouchStartX = 0;
let gcsFreshBannerTouchEndX = 0;

// Jalankan ketika struktur dokumen HTML telah diload
document.addEventListener("DOMContentLoaded", () => {
    gcsFreshBannerInit();
});

/**
 * Memulai inisialisasi filter waktu dan pembuatan elemen visual
 */
function gcsFreshBannerInit() {
    gcsFreshBannerActiveItems = gcsFreshBannerCheckSchedule(gcsFreshBannerData);
    gcsFreshBannerRender(gcsFreshBannerActiveItems);
}

/**
 * Melakukan seleksi banner yang valid berdasarkan tanggal tayang hari ini
 * @param {Array} bannerList - Data kumpulan banner
 * @returns {Array} List banner yang lolos syarat waktu
 */
function gcsFreshBannerCheckSchedule(bannerList) {
    const gcsFreshBannerNow = new Date().getTime();

    return bannerList.filter(item => {
        // Replace tanda "-" menjadi "/" agar dapat dibaca mulus oleh engine Safari/iOS
        const gcsFreshBannerStartTime = new Date(item.start.replace(/-/g, "/")).getTime();
        const gcsFreshBannerEndTime = new Date(item.end.replace(/-/g, "/")).getTime();

        // Perbandingan waktu: start <= current <= end
        return gcsFreshBannerNow >= gcsFreshBannerStartTime && gcsFreshBannerNow <= gcsFreshBannerEndTime;
    });
}

/**
 * Mencetak kumpulan elemen DOM secara otomatis jika terdapat banner aktif
 * @param {Array} activeBanners - Array data banner aktif hasil saringan waktu
 */
function gcsFreshBannerRender(activeBanners) {
    const gcsFreshBannerMainWrapper = document.getElementById("gcsFreshBannerContainer");
    if (!gcsFreshBannerMainWrapper) return;

    // FITUR FRAME OTOMATIS: Kolaps frame menjadi tinggi 0 jika daftar banner kosong
    if (activeBanners.length === 0) {
        gcsFreshBannerMainWrapper.classList.add("gcsFreshBannerCollapse");
        gcsFreshBannerMainWrapper.innerHTML = "";
        return;
    }

    // Tarik kelas kolaps jika ada banner yang masuk jadwal tayang
    gcsFreshBannerMainWrapper.classList.remove("gcsFreshBannerCollapse");

    // Konstruksi DOM Judul "Promo Fresh"
    const gcsFreshBannerHeaderNode = document.createElement("div");
    gcsFreshBannerHeaderNode.classList.add("gcsFreshBannerHeader");

    const gcsFreshBannerTitleNode = document.createElement("h2");
    gcsFreshBannerTitleNode.classList.add("gcsFreshBannerTitle");
    gcsFreshBannerTitleNode.textContent = "Promo Fresh";
    gcsFreshBannerHeaderNode.appendChild(gcsFreshBannerTitleNode);
    gcsFreshBannerMainWrapper.appendChild(gcsFreshBannerHeaderNode);

    // Konstruksi DOM Area Slider Utama
    const gcsFreshBannerSliderNode = document.createElement("div");
    gcsFreshBannerSliderNode.classList.add("gcsFreshBannerSlider");

    // Konstruksi DOM Jalur Track
    const gcsFreshBannerTrackNode = document.createElement("div");
    gcsFreshBannerTrackNode.classList.add("gcsFreshBannerTrack");
    gcsFreshBannerTrackNode.id = "gcsFreshBannerTrackEl";

    // Perulangan pembuatan Item, Link (<a>), dan Image (<img>)
    activeBanners.forEach(banner => {
        const gcsFreshBannerItemNode = document.createElement("div");
        gcsFreshBannerItemNode.classList.add("gcsFreshBannerItem");

        const gcsFreshBannerAnchorNode = document.createElement("a");
        gcsFreshBannerAnchorNode.classList.add("gcsFreshBannerLink");
        gcsFreshBannerAnchorNode.setAttribute("href", banner.link);

        const gcsFreshBannerImgNode = document.createElement("img");
        gcsFreshBannerImgNode.classList.add("gcsFreshBannerImage");
        gcsFreshBannerImgNode.setAttribute("src", banner.image);
        gcsFreshBannerImgNode.setAttribute("alt", "Promo Fresh GOCES");
        gcsFreshBannerImgNode.setAttribute("loading", "lazy");

        gcsFreshBannerAnchorNode.appendChild(gcsFreshBannerImgNode);
        gcsFreshBannerItemNode.appendChild(gcsFreshBannerAnchorNode);
        gcsFreshBannerTrackNode.appendChild(gcsFreshBannerItemNode);
    });

    gcsFreshBannerSliderNode.appendChild(gcsFreshBannerTrackNode);
    gcsFreshBannerMainWrapper.appendChild(gcsFreshBannerSliderNode);

    // Perintahkan pembuatan dot indikator
    gcsFreshBannerCreateDots(activeBanners.length, gcsFreshBannerMainWrapper);

    // Apabila banner berjumlah di atas satu, hidupkan slide otomatis dan sensor geser
    if (activeBanners.length > 1) {
        gcsFreshBannerAutoSlide();
        gcsFreshBannerSwipe(gcsFreshBannerSliderNode);
    }
}

/**
 * Menghitung serta membangun dot sesuai aturan batas yang diminta
 * @param {number} totalActiveBanners - Angka jumlah tayang
 * @param {HTMLElement} parentWrapper - Node tempat menempel dot
 */
function gcsFreshBannerCreateDots(totalActiveBanners, parentWrapper) {
    const gcsFreshBannerDotsContainer = document.createElement("div");
    gcsFreshBannerDotsContainer.classList.add("gcsFreshBannerDots");
    gcsFreshBannerDotsContainer.id = "gcsFreshBannerDotsContainerEl";

    // ATURAN PEMBATAS DOT: Sembunyikan bila banner cuma 1, atau melebihi 5 banner aktif.
    if (totalActiveBanners === 1 || totalActiveBanners > 5) {
        gcsFreshBannerDotsContainer.classList.add("gcsFreshBannerHidden");
    }

    // Reproduksi span titik indikator
    for (let i = 0; i < totalActiveBanners; i++) {
        const gcsFreshBannerDotNode = document.createElement("span");
        gcsFreshBannerDotNode.classList.add("gcsFreshBannerDot");
        if (i === 0) {
            gcsFreshBannerDotNode.classList.add("gcsFreshBannerActive");
        }
        gcsFreshBannerDotsContainer.appendChild(gcsFreshBannerDotNode);
    }

    parentWrapper.appendChild(gcsFreshBannerDotsContainer);
}

/**
 * Transformasi CSS untuk menggeser posisi Track antar slide
 * @param {number} indexTarget - Nomor posisi array berikutnya
 */
function gcsFreshBannerGoToSlide(indexTarget) {
    const gcsFreshBannerTrackEl = document.getElementById("gcsFreshBannerTrackEl");
    const gcsFreshBannerDotsContainerEl = document.getElementById("gcsFreshBannerDotsContainerEl");

    if (!gcsFreshBannerTrackEl) return;

    gcsFreshBannerCurrentIndex = indexTarget;
    gcsFreshBannerTrackEl.style.transform = `translateX(-${gcsFreshBannerCurrentIndex * 100}%)`;

    // Pembaruan styling posisi dot yang sedang menyala
    if (gcsFreshBannerDotsContainerEl && !gcsFreshBannerDotsContainerEl.classList.contains("gcsFreshBannerHidden")) {
        const gcsFreshBannerDotCollection = gcsFreshBannerDotsContainerEl.querySelectorAll(".gcsFreshBannerDot");
        gcsFreshBannerDotCollection.forEach((dot, index) => {
            if (index === gcsFreshBannerCurrentIndex) {
                dot.classList.add("gcsFreshBannerActive");
            } else {
                dot.classList.remove("gcsFreshBannerActive");
            }
        });
    }
}

/**
 * Manuver manual lompat ke slide posisi setelahnya
 */
function gcsFreshBannerNext() {
    if (gcsFreshBannerCurrentIndex < gcsFreshBannerActiveItems.length - 1) {
        gcsFreshBannerGoToSlide(gcsFreshBannerCurrentIndex + 1);
    } else {
        gcsFreshBannerGoToSlide(0); // Mulai kembali siklus ke indeks nol
    }
}

/**
 * Manuver manual lompat ke slide posisi sebelumnya
 */
function gcsFreshBannerPrevious() {
    if (gcsFreshBannerCurrentIndex > 0) {
        gcsFreshBannerGoToSlide(gcsFreshBannerCurrentIndex - 1);
    } else {
        gcsFreshBannerGoToSlide(gcsFreshBannerActiveItems.length - 1); // Lompat ke ujung terakhir
    }
}

/**
 * Auto-interval transisi slide per 4000ms
 */
function gcsFreshBannerAutoSlide() {
    gcsFreshBannerTimer = setInterval(() => {
        gcsFreshBannerNext();
    }, 4000);
}

/**
 * Event penangkap interaksi usapan sentuh pada device layar sentuh
 * @param {HTMLElement} sliderElement - Area kontainer DOM
 */
function gcsFreshBannerSwipe(sliderElement) {
    sliderElement.addEventListener("touchstart", (e) => {
        gcsFreshBannerTouchStartX = e.changedTouches[0].screenX;
        clearInterval(gcsFreshBannerTimer); // Amankan autoplay sementara jari ditekan
    }, { passive: true });

    sliderElement.addEventListener("touchend", (e) => {
        gcsFreshBannerTouchEndX = e.changedTouches[0].screenX;
        gcsFreshBannerHandleSwipeGesture();

        // Jalankan timer kembali pasca sentuhan dilepas
        clearInterval(gcsFreshBannerTimer);
        gcsFreshBannerAutoSlide();
    }, { passive: true });
}

/**
 * Evaluasi pergerakan titik koordinat jari X (usap silang horizontal)
 */
function gcsFreshBannerHandleSwipeGesture() {
    const gcsFreshBannerSwipeThreshold = 45; // Pixel minimal untuk disahkan menjadi Swipe Valid

    // Trigger Swipe ke sisi Kiri (Slide Sesudah)
    if (gcsFreshBannerTouchStartX - gcsFreshBannerTouchEndX > gcsFreshBannerSwipeThreshold) {
        gcsFreshBannerNext();
    }

    // Trigger Swipe ke sisi Kanan (Slide Sebelum)
    if (gcsFreshBannerTouchEndX - gcsFreshBannerTouchStartX > gcsFreshBannerSwipeThreshold) {
        gcsFreshBannerPrevious();
    }
}