// ===================================================
// PENGATURAN BANNER HALAMAN PROMO
// Tambahkan banner baru di bawah ini
// ===================================================
const gcsHalamanPromoBannerData = [
    {
        // ===================================================
        // GANTI GAMBAR BANNER
        // ===================================================
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
        // ===================================================
        // GANTI LINK PROMO
        // ===================================================
        link: "promo-detail-1.html",
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
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        link: "promo-detail-2.html",
        start: "2026-07-01 00:00:00",
        end: "2026-07-28 23:59:59"
    },
    // ===================================================
    // TAMBAHKAN BANNER BARU
    // Salin object di bawah ini
    // ===================================================
];

// --- VARIABEL STATE ---
let gcsHalamanPromoBannerCurrentIndex = 0;
let gcsHalamanPromoBannerActiveItems = [];
let gcsHalamanPromoBannerTimer = null;
let gcsHalamanPromoBannerTouchStartX = 0;
let gcsHalamanPromoBannerTouchEndX = 0;

document.addEventListener("DOMContentLoaded", () => {
    gcsHalamanPromoBannerInit();
});

/**
 * Inisialisasi Komponen
 */
function gcsHalamanPromoBannerInit() {
    gcsHalamanPromoBannerActiveItems = gcsHalamanPromoBannerCheckSchedule(gcsHalamanPromoBannerData);
    gcsHalamanPromoBannerRender(gcsHalamanPromoBannerActiveItems);
}

/**
 * Filter data berdasarkan jadwal
 */
function gcsHalamanPromoBannerCheckSchedule(bannerList) {
    const gcsHalamanPromoBannerNow = new Date().getTime();
    return bannerList.filter(item => {
        const gcsHalamanPromoBannerStartTime = new Date(item.start.replace(/-/g, "/")).getTime();
        const gcsHalamanPromoBannerEndTime = new Date(item.end.replace(/-/g, "/")).getTime();
        return gcsHalamanPromoBannerNow >= gcsHalamanPromoBannerStartTime && gcsHalamanPromoBannerNow <= gcsHalamanPromoBannerEndTime;
    });
}

/**
 * Render DOM
 */
function gcsHalamanPromoBannerRender(activeBanners) {
    const gcsHalamanPromoBannerMainWrapper = document.getElementById("gcsHalamanPromoBannerContainer");
    if (!gcsHalamanPromoBannerMainWrapper) return;

    if (activeBanners.length === 0) {
        gcsHalamanPromoBannerMainWrapper.classList.add("gcsHalamanPromoBannerCollapse");
        gcsHalamanPromoBannerMainWrapper.innerHTML = "";
        return;
    }

    gcsHalamanPromoBannerMainWrapper.classList.remove("gcsHalamanPromoBannerCollapse");

    // Title
    const gcsHalamanPromoBannerHeaderNode = document.createElement("div");
    gcsHalamanPromoBannerHeaderNode.classList.add("gcsHalamanPromoBannerHeader");
    const gcsHalamanPromoBannerTitleNode = document.createElement("h2");
    gcsHalamanPromoBannerTitleNode.classList.add("gcsHalamanPromoBannerTitle");
    gcsHalamanPromoBannerTitleNode.textContent = "Promo Pilihan";
    gcsHalamanPromoBannerHeaderNode.appendChild(gcsHalamanPromoBannerTitleNode);
    gcsHalamanPromoBannerMainWrapper.appendChild(gcsHalamanPromoBannerHeaderNode);

    // Slider
    const gcsHalamanPromoBannerSliderNode = document.createElement("div");
    gcsHalamanPromoBannerSliderNode.classList.add("gcsHalamanPromoBannerSlider");
    const gcsHalamanPromoBannerTrackNode = document.createElement("div");
    gcsHalamanPromoBannerTrackNode.classList.add("gcsHalamanPromoBannerTrack");
    gcsHalamanPromoBannerTrackNode.id = "gcsHalamanPromoBannerTrackEl";

    activeBanners.forEach(banner => {
        const item = document.createElement("div");
        item.classList.add("gcsHalamanPromoBannerItem");
        const link = document.createElement("a");
        link.classList.add("gcsHalamanPromoBannerLink");
        link.href = banner.link;
        const img = document.createElement("img");
        img.classList.add("gcsHalamanPromoBannerImage");
        img.src = banner.image;
        img.loading = "lazy";
        link.appendChild(img);
        item.appendChild(link);
        gcsHalamanPromoBannerTrackNode.appendChild(item);
    });

    gcsHalamanPromoBannerSliderNode.appendChild(gcsHalamanPromoBannerTrackNode);
    gcsHalamanPromoBannerMainWrapper.appendChild(gcsHalamanPromoBannerSliderNode);

    gcsHalamanPromoBannerCreateDots(activeBanners.length, gcsHalamanPromoBannerMainWrapper);

    if (activeBanners.length > 1) {
        gcsHalamanPromoBannerAutoSlide();
        gcsHalamanPromoBannerSwipe(gcsHalamanPromoBannerSliderNode);
    }
}

/**
 * Indikator Dot
 */
function gcsHalamanPromoBannerCreateDots(count, parent) {
    const container = document.createElement("div");
    container.classList.add("gcsHalamanPromoBannerDots");
    container.id = "gcsHalamanPromoBannerDotsContainerEl";

    if (count === 1 || count > 5) container.classList.add("gcsHalamanPromoBannerHidden");

    for (let i = 0; i < count; i++) {
        const dot = document.createElement("span");
        dot.classList.add("gcsHalamanPromoBannerDot");
        if (i === 0) dot.classList.add("gcsHalamanPromoBannerActive");
        container.appendChild(dot);
    }
    parent.appendChild(container);
}

/**
 * Slide Logic
 */
function gcsHalamanPromoBannerGoToSlide(index) {
    const track = document.getElementById("gcsHalamanPromoBannerTrackEl");
    const dotsContainer = document.getElementById("gcsHalamanPromoBannerDotsContainerEl");
    if (!track) return;
    gcsHalamanPromoBannerCurrentIndex = index;
    track.style.transform = `translateX(-${gcsHalamanPromoBannerCurrentIndex * 100}%)`;

    if (dotsContainer && !dotsContainer.classList.contains("gcsHalamanPromoBannerHidden")) {
        const dots = dotsContainer.querySelectorAll(".gcsHalamanPromoBannerDot");
        dots.forEach((dot, idx) => {
            dot.classList.toggle("gcsHalamanPromoBannerActive", idx === index);
        });
    }
}

function gcsHalamanPromoBannerNext() {
    gcsHalamanPromoBannerGoToSlide(
        gcsHalamanPromoBannerCurrentIndex < gcsHalamanPromoBannerActiveItems.length - 1
            ? gcsHalamanPromoBannerCurrentIndex + 1
            : 0
    );
}

function gcsHalamanPromoBannerPrevious() {
    gcsHalamanPromoBannerGoToSlide(
        gcsHalamanPromoBannerCurrentIndex > 0
            ? gcsHalamanPromoBannerCurrentIndex - 1
            : gcsHalamanPromoBannerActiveItems.length - 1
    );
}

function gcsHalamanPromoBannerAutoSlide() {
    gcsHalamanPromoBannerTimer = setInterval(gcsHalamanPromoBannerNext, 4000);
}

function gcsHalamanPromoBannerSwipe(el) {
    el.addEventListener("touchstart", (e) => {
        gcsHalamanPromoBannerTouchStartX = e.changedTouches[0].screenX;
        clearInterval(gcsHalamanPromoBannerTimer);
    }, { passive: true });

    el.addEventListener("touchend", (e) => {
        gcsHalamanPromoBannerTouchEndX = e.changedTouches[0].screenX;
        const diff = gcsHalamanPromoBannerTouchStartX - gcsHalamanPromoBannerTouchEndX;
        if (diff > 45) gcsHalamanPromoBannerNext();
        else if (diff < -45) gcsHalamanPromoBannerPrevious();
        clearInterval(gcsHalamanPromoBannerTimer);
        gcsHalamanPromoBannerAutoSlide();
    }, { passive: true });
}