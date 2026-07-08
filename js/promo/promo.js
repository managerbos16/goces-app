/**
 * GOCES Promo Page JavaScript
 * Menerapkan standar performa dan penamaan gcsPromo
 */

// STATE & DATA
const gcsPromoCategories = [
    "Semua", "GoRide", "GoCar", "GoFood", "Delivery", "Shop", "Fresh",
    "PPOB", "Travel", "Hotel", "Keuangan", "Belanja", "Voucher Digital",
    "Cashback", "Diskon", "Gratis Ongkir", "Flash Sale"
];

let gcsPromoActiveCategory = "Semua";
let gcsPromoVouchersData = [];
let gcsPromoSearchTimeout = null;

// INIT
document.addEventListener("DOMContentLoaded", gcsPromoInit);

function gcsPromoInit() {
    gcsPromoGenerateDummyData();
    gcsPromoRenderCategories();
    gcsPromoRenderContent();
    gcsPromoInitCountdown();
    gcsPromoSetupSearch();
    gcsPromoSetupEventDelegation();
}

// GENERATE 50 DUMMY VOUCHERS
function gcsPromoGenerateDummyData() {
    const templates = [
        { title: "GoRide 50%", desc: "Potongan hingga Rp50.000", cat: "GoRide", badge: "Diskon", prefix: "GORIDE" },
        { title: "GoCar 40%", desc: "Potongan hingga Rp40.000", cat: "GoCar", badge: "Diskon", prefix: "GOCAR" },
        { title: "GoFood Cashback", desc: "Cashback hingga 50.000 koin", cat: "GoFood", badge: "Cashback", prefix: "GOFOOD" },
        { title: "Delivery Gratis Ongkir", desc: "Gratis ongkir max Rp20.000", cat: "Delivery", badge: "Gratis Ongkir", prefix: "KIRIM" },
        { title: "Shop Diskon 30%", desc: "Diskon belanja bulanan", cat: "Shop", badge: "Diskon", prefix: "SHOP" },
        { title: "Fresh Hemat 25%", desc: "Beli sayur segar hemat", cat: "Fresh", badge: "Diskon", prefix: "FRESH" },
        { title: "PPOB Cashback", desc: "Bayar tagihan dapat cashback", cat: "PPOB", badge: "Cashback", prefix: "PPOB" },
        { title: "Hotel Diskon", desc: "Liburan murah s.d 40%", cat: "Hotel", badge: "Limited", prefix: "STAY" },
        { title: "Travel Promo", desc: "Tiket pesawat murah", cat: "Travel", badge: "Diskon", prefix: "FLY" },
        { title: "Pulsa Cashback", desc: "Isi pulsa cuan", cat: "PPOB", badge: "Cashback", prefix: "PULSA" },
        { title: "Token PLN Promo", desc: "Diskon beli token", cat: "PPOB", badge: "Diskon", prefix: "LISTRIK" },
        { title: "Voucher Belanja", desc: "Voucher mall pilihan", cat: "Belanja", badge: "Diskon", prefix: "MALL" },
        { title: "Voucher Netflix", desc: "Streaming sepuasnya", cat: "Voucher Digital", badge: "Diskon", prefix: "NFLX" },
        { title: "Voucher Spotify", desc: "Dengar lagu tanpa jeda", cat: "Voucher Digital", badge: "Diskon", prefix: "SPOT" },
        { title: "Voucher Game", desc: "Top up diamond murah", cat: "Voucher Digital", badge: "Cashback", prefix: "GAME" },
        { title: "Flash Sale Burger", desc: "Diskon kilat jam 12", cat: "Flash Sale", badge: "Limited", prefix: "FLASH" }
    ];

    for (let i = 0; i < 50; i++) {
        const tpl = templates[i % templates.length];
        gcsPromoVouchersData.push({
            id: `gcs_v_${i}`,
            title: `${tpl.title} - ${i + 1}`,
            desc: tpl.desc,
            code: `${tpl.prefix}${Math.floor(Math.random() * 9000) + 1000}`,
            expiry: "31 Desember 2026",
            minPurchase: `Rp${(Math.floor(Math.random() * 10) + 2) * 10}.000`,
            badge: tpl.badge,
            category: tpl.cat,
            isFlash: i < 6, // 6 items for flash
            isPopular: i >= 6 && i < 14, // 8 items for popular
            isLatest: i >= 14 // rest for latest
        });
    }
}

// RENDER CATEGORIES
function gcsPromoRenderCategories() {
    const list = document.getElementById("gcsPromoCategoryList");
    let html = "";

    gcsPromoCategories.forEach(cat => {
        const isActive = cat === gcsPromoActiveCategory ? "gcsPromoActive" : "";
        html += `<li class="gcsPromoChip ${isActive}" data-category="${cat}">${cat}</li>`;
    });

    list.innerHTML = html;
}

// FILTER LOGIC
function gcsPromoFilter(category) {
    if (gcsPromoActiveCategory === category) return;

    gcsPromoActiveCategory = category;
    gcsPromoRenderCategories(); // Update UI active state

    const contentArea = document.getElementById("gcsPromoContentArea");

    // Smooth transition
    requestAnimationFrame(() => {
        contentArea.classList.add("gcsPromoHidden");

        setTimeout(() => {
            gcsPromoRenderContent();
            // Trigger reflow
            void contentArea.offsetWidth;
            contentArea.classList.remove("gcsPromoHidden");
        }, 250); // Matches var(--transition) 0.25s
    });
}

// RENDER CONTENT BASED ON CATEGORY & SEARCH
function gcsPromoRenderContent() {
    const contentArea = document.getElementById("gcsPromoContentArea");
    const searchQuery = document.getElementById("search").value.toLowerCase();

    let filteredData = gcsPromoVouchersData.filter(v => {
        const matchCategory = gcsPromoActiveCategory === "Semua" || v.category === gcsPromoActiveCategory;
        const matchSearch = v.title.toLowerCase().includes(searchQuery) || v.desc.toLowerCase().includes(searchQuery);
        return matchCategory && matchSearch;
    });

    if (filteredData.length === 0) {
        contentArea.innerHTML = `<div style="text-align:center; padding: 40px 16px; color: var(--text);">Belum ada promo untuk kategori ini.</div>`;
        return;
    }

    let html = "";

    // If 'Semua' and no search, render structured sections. Otherwise render flat grid.
    if (gcsPromoActiveCategory === "Semua" && !searchQuery) {

        // FLASH PROMO
        const flashData = filteredData.filter(v => v.isFlash);
        if (flashData.length > 0) {
            html += `
            <section class="gcsPromoSection">
                <div class="gcsPromoSectionHeader">
                    <h2 class="gcsPromoSectionTitle">⚡ Flash Promo</h2>
                    <div class="gcsPromoCountdown" id="gcsPromoCountdownBox">
                        <span class="gcsPromoTimeBox" id="gcsPromoHour">00</span>
                        <span class="gcsPromoTimeColon">:</span>
                        <span class="gcsPromoTimeBox" id="gcsPromoMin">00</span>
                        <span class="gcsPromoTimeColon">:</span>
                        <span class="gcsPromoTimeBox" id="gcsPromoSec">00</span>
                    </div>
                </div>
                <div class="gcsPromoSlider">
                    ${flashData.map(v => gcsPromoCreateCardHTML(v)).join('')}
                </div>
            </section>`;
        }

        // POPULAR
        const popularData = filteredData.filter(v => v.isPopular);
        if (popularData.length > 0) {
            html += `
            <section class="gcsPromoSection">
                <div class="gcsPromoSectionHeader">
                    <h2 class="gcsPromoSectionTitle">🔥 Voucher Terpopuler</h2>
                </div>
                <div class="gcsPromoSlider">
                    ${popularData.map(v => gcsPromoCreateCardHTML(v)).join('')}
                </div>
            </section>`;
        }

        // LATEST
        const latestData = filteredData.filter(v => v.isLatest);
        if (latestData.length > 0) {
            html += `
            <section class="gcsPromoSection">
                <div class="gcsPromoSectionHeader">
                    <h2 class="gcsPromoSectionTitle">🆕 Voucher Terbaru</h2>
                </div>
                <div class="gcsPromoGrid2Col">
                    ${latestData.map(v => gcsPromoCreateCardHTML(v)).join('')}
                </div>
            </section>`;
        }

    } else {
        // FLAT GRID FOR FILTERED/SEARCHED RESULTS
        html += `
        <section class="gcsPromoSection">
            <div class="gcsPromoGrid2Col">
                ${filteredData.map(v => gcsPromoCreateCardHTML(v)).join('')}
            </div>
        </section>`;
    }

    contentArea.innerHTML = html;
}

// CARD HTML TEMPLATE
function gcsPromoCreateCardHTML(voucher) {
    let badgeClass = "gcsPromoBadgeInfo";
    if (voucher.badge.toLowerCase() === "diskon") badgeClass = "gcsPromoBadgeWarning";
    if (voucher.badge.toLowerCase() === "cashback") badgeClass = "gcsPromoBadgeSuccess";
    if (voucher.badge.toLowerCase() === "limited") badgeClass = "gcsPromoBadgeWarning";

    return `
    <div class="gcsPromoCard" data-id="${voucher.id}">
        <div class="gcsPromoCardHeader">
            <span class="gcsPromoBadge ${badgeClass}" style="align-self: flex-start; margin-bottom: 8px;">${voucher.badge}</span>
            <h3 class="gcsPromoCardTitle">${voucher.title}</h3>
            <p class="gcsPromoCardDesc">${voucher.desc}</p>
        </div>
        <div class="gcsPromoCodeBox">${voucher.code}</div>
        <div class="gcsPromoCardMeta">
            Min. trx ${voucher.minPurchase} • Berlaku s.d ${voucher.expiry}
        </div>
        <div class="gcsPromoCardDivider"></div>
        <div class="gcsPromoCardAction">
            <button class="gcsPromoCardBtn" data-action="ambil" data-id="${voucher.id}">Ambil Voucher</button>
        </div>
    </div>`;
}

// COUNTDOWN LOGIC
function gcsPromoInitCountdown() {
    let targetTime = new Date().getTime() + (3 * 60 * 60 * 1000); // 3 hours from now

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            targetTime = new Date().getTime() + (24 * 60 * 60 * 1000); // reset 24h
            requestAnimationFrame(updateTimer);
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const elH = document.getElementById("gcsPromoHour");
        const elM = document.getElementById("gcsPromoMin");
        const elS = document.getElementById("gcsPromoSec");

        if (elH) elH.textContent = String(hours).padStart(2, '0');
        if (elM) elM.textContent = String(minutes).padStart(2, '0');
        if (elS) elS.textContent = String(seconds).padStart(2, '0');

        setTimeout(() => requestAnimationFrame(updateTimer), 1000);
    }

    requestAnimationFrame(updateTimer);
}

// DEBOUNCE SEARCH
function gcsPromoSetupSearch() {
    const searchInput = document.getElementById("search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        clearTimeout(gcsPromoSearchTimeout);
        gcsPromoSearchTimeout = setTimeout(() => {
            const contentArea = document.getElementById("gcsPromoContentArea");
            contentArea.classList.add("gcsPromoHidden");

            setTimeout(() => {
                gcsPromoRenderContent();
                contentArea.classList.remove("gcsPromoHidden");
            }, 200);
        }, 300);
    });

    // Prevent default form submit reload
    searchInput.closest('form').addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

// EVENT DELEGATION
function gcsPromoSetupEventDelegation() {
    document.addEventListener("click", (e) => {
        // Category Click
        if (e.target.classList.contains("gcsPromoChip")) {
            const category = e.target.getAttribute("data-category");
            if (category) gcsPromoFilter(category);
        }

        // Ambil Voucher Click
        if (e.target.dataset.action === "ambil") {
            e.stopPropagation();
            const btn = e.target;
            const originalText = btn.textContent;

            // Dummy loading/success state
            btn.textContent = "Berhasil!";
            btn.style.background = "#166534"; // Success color

            setTimeout(() => {
                btn.textContent = "Dipakai";
                btn.style.background = "var(--gray)";
                btn.style.color = "var(--text)";
                btn.style.border = "1px solid var(--border)";
                btn.disabled = true;
            }, 1000);
        }

        // Card Click (Dummy Action)
        const card = e.target.closest(".gcsPromoCard");
        if (card && e.target.dataset.action !== "ambil") {
            const id = card.getAttribute("data-id");
            console.log("Membuka detail voucher: " + id);
        }
    });
}