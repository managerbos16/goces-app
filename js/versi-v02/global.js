let pageHistory = [];
let currentPage = 'home';

history.replaceState(
    { page: 'home' },
    '',
    '#home'
);

// =========================
// AKTIFKAN NAVBAR
// =========================

function activateNav(pageName) {

    document
        .querySelectorAll('.nav-item')
        .forEach(nav => {

            nav.classList.remove('active');

            if (
                nav.dataset.page === pageName
            ) {
                nav.classList.add('active');
            }

        });

}

function syncBottomNav(pageName) {
    const bottomNav =
        document.querySelector(".bottom-nav");

    if (!bottomNav) {
        return;
    }

    const hideNavPages = [
        "goces-detail",
        "goces-payment",
        "goces-waiting",
        "goces-success",
    ];

    bottomNav.style.display =
        hideNavPages.includes(pageName)
            ? "none"
            : "flex";
}

// =========================
// TAMPILKAN HALAMAN
// =========================

function showPage(name, btn = null) {

    if (currentPage === name) {
        return;
    }

    pageHistory.push(currentPage);

    history.pushState(
        { page: name },
        '',
        '#' + name
    );

    document
        .querySelectorAll('.page')
        .forEach(page => {
            page.classList.remove('active');
        });

    const targetPage =
        document.getElementById(
            'page-' + name
        );

    if (targetPage) {
        targetPage.classList.add('active');
    }

    activateNav(name);

    currentPage = name;

    window.dispatchEvent(new CustomEvent("goces:pagechange", {
        detail: { page: name }
    }));

    /*==================================
        SHOW / HIDE BOTTOM NAV
==================================*/
    syncBottomNav(name);

    console.log(
        'Current Page:',
        currentPage
    );

    console.log(
        'History:',
        pageHistory
    );

}

// =========================
// TOMBOL KEMBALI MANUAL
// =========================

function goBack() {

    if (
        pageHistory.length === 0
    ) {
        return;
    }

    const previousPage =
        pageHistory.pop();

    document
        .querySelectorAll('.page')
        .forEach(page => {
            page.classList.remove('active');
        });

    const targetPage =
        document.getElementById(
            'page-' + previousPage
        );

    if (targetPage) {
        targetPage.classList.add('active');
    }

    activateNav(previousPage);
    syncBottomNav(previousPage);

    currentPage = previousPage;

    window.dispatchEvent(new CustomEvent("goces:pagechange", {
        detail: { page: previousPage }
    }));

}

// =========================
// BACK ANDROID
// =========================

window.addEventListener(
    'popstate',
    function () {

        if (
            pageHistory.length === 0
        ) {
            return;
        }

        const previousPage =
            pageHistory.pop();

        document
            .querySelectorAll('.page')
            .forEach(page => {
                page.classList.remove('active');
            });

        const targetPage =
            document.getElementById(
                'page-' + previousPage
            );

        if (targetPage) {
            targetPage.classList.add('active');
        }

        activateNav(previousPage);
        syncBottomNav(previousPage);

        currentPage = previousPage;

        window.dispatchEvent(new CustomEvent("goces:pagechange", {
            detail: { page: previousPage }
        }));

    }
);

// =========================
// ORDERS TAB
// =========================

document
    .querySelectorAll('.orders-tab')
    .forEach(tab => {

        tab.addEventListener(
            'click',
            function () {

                document
                    .querySelectorAll('.orders-tab')
                    .forEach(t => {
                        t.classList.remove('active');
                    });

                this.classList.add('active');

            }
        );

    });


// =========================
// script benner slide
// =========================
window.addEventListener(
    "message",
    function (event) {

        const element =
            document.getElementById(
                event.data.containerId
            );

        if (!element) {
            return;
        }

        if (
            event.data.type === "emptyBanner"
        ) {

            element.style.display =
                "none";

        }

        if (
            event.data.type === "bannerLoaded"
        ) {

            element.style.display =
                "block";

        }

    }
);

// =========================
// script lupa nama
// =========================
window.addEventListener("message", function (event) {

    if (event.data.type === "emptyCategory") {

        const frame = event.source.frameElement;

        if (frame) {

            const container = frame.parentElement;

            if (container) {

                container.style.display = "none";

            }

        }

    }

});

// =========================
// script benner promo atau halaman promo
// =========================
// =============================
// KONFIGURASI
// =============================
let gprCurrentCategory = null;
const gprKategoriVoucher = [
    "populer",
    "terbaru",
    "eksklusif",
    "cashback",
    "terbatas"
];

// =============================
// KATEGORI
// =============================
function gprOpenCategory(event, category) {

    const buttons =
        document.querySelectorAll(
            ".gpr-category button"
        );

    const sections =
        document.querySelectorAll(
            ".gpr-content"
        );

    if (
        gprCurrentCategory === category
    ) {

        document
            .getElementById(category)
            .style.display = "none";

        event.currentTarget
            .classList.remove("active");

        gprCurrentCategory = null;

        return;

    }

    sections.forEach(section => {
        section.style.display = "none";
    });

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    document
        .getElementById(category)
        .style.display = "block";

    event.currentTarget
        .classList.add("active");

    gprCurrentCategory = category;

}

// =============================
// BUKA SEMUA
// =============================
function gprOpenAllVoucher() {

    document
        .querySelectorAll(".gpr-content")
        .forEach(section => {

            section.style.display = "none";

        });

    document
        .querySelectorAll(".gpr-category button")
        .forEach(button => {

            button.classList.remove("active");

        });

    document
        .getElementById("semua")
        .style.display = "block";

    document
        .getElementById("gprBtnSemua")
        .classList.add("active");

    gprCurrentCategory = "semua";

}

// =============================
// STATUS VOUCHER
// =============================
/*  function gprIsVoucherActive(voucher) {

    const now =
        new Date();

    const start =
        new Date(
            voucher.dataset.start
        );

    const end =
        new Date(
            voucher.dataset.end
        );

    return (

        now >= start &&

        now <= end

    );

}  */

// =============================
// UPDATE STATUS VOUCHER
// =============================
/*  function gprUpdateVoucherStatus() {

    gprKategoriVoucher.forEach(id => {

        document
            .querySelectorAll(
                "#" + id + " .gpr-voucher-card"
            )
            .forEach(voucher => {

                if (
                    gprIsVoucherActive(voucher)
                ) {

                    voucher.classList
                        .remove("hide");

                } else {

                    voucher.classList
                        .add("hide");

                }

            });

    });

    gprUpdateSemuaVoucher();

    gprUpdateVoucherCount();

}  */

// =============================
// HALAMAN SEMUA
// =============================
/*  function gprUpdateSemuaVoucher() {

    const semua =
        document.getElementById(
            "semua"
        );

    semua.innerHTML = "";

    gprKategoriVoucher.forEach(id => {

        document
            .querySelectorAll(
                "#" + id +
                " .gpr-voucher-card"
            )
            .forEach(voucher => {

                // hanya tampilkan voucher aktif
                if (
                    !voucher.classList.contains(
                        "hide"
                    )
                ) {

                    semua.innerHTML +=
                        voucher.outerHTML;

                }

            });

    });

}  */

// =============================
// JUMLAH VOUCHER AKTIF
// =============================
/* function gprUpdateVoucherCount() {

    let total = 0;

    gprKategoriVoucher.forEach(id => {

        document
            .querySelectorAll(
                "#" + id +
                " .gpr-voucher-card"
            )
            .forEach(voucher => {

                if (
                    !voucher.classList.contains(
                        "hide"
                    )
                ) {

                    total++;

                }

            });

    });

    document
        .getElementById(
            "gprActiveVoucherCount"
        )
        .innerHTML =

        total + " Voucher Aktif";

} */

// =============================
// SALIN VOUCHER
// =============================
/* function gprCopyVoucher(button) {

    const voucher =
        button.closest(
            ".gpr-voucher-card"
        );

    const code =
        voucher.dataset.code;

    const input =
        document.createElement(
            "input"
        );

    input.value = code;

    document.body
        .appendChild(input);

    input.select();

    document.execCommand(
        "copy"
    );

    document.body
        .removeChild(input);

    button.innerHTML =
        "Tersalin ✓";

    setTimeout(function () {

        button.innerHTML =
            "Salin";

    }, 2000);

    gprShowToast(

        "Kode voucher " +
        code +
        " berhasil disalin"
    );

} */

// =============================
// TOAST
// =============================
/* function gprShowToast(message) {

    const toast =
        document.getElementById(
            "gprToast"
        );

    toast.innerHTML =
        message;

    toast.style.display =
        "block";

    clearTimeout(
        window.gprToastTimer
    );

    window.gprToastTimer =
        setTimeout(function () {

            toast.style.display =
                "none";

        }, 2000);

} */

// =============================
// COUNTDOWN
// =============================
/* function gprUpdateCountdown() {

    document
        .querySelectorAll(
            ".gpr-voucher-card"
        )
        .forEach(voucher => {

            const box =
                voucher.querySelector(
                    ".gpr-countdown"
                );

            if (!box) return;

            const end =
                new Date(
                    voucher.dataset.end
                );

            const now =
                new Date();

            let diff =
                end - now;

            if (diff <= 0) {

                box.innerHTML = "";

                return;

            }

            const day =
                Math.floor(
                    diff / 86400000
                );

            diff %= 86400000;

            const hour =
                Math.floor(
                    diff / 3600000
                );

            diff %= 3600000;

            const minute =
                Math.floor(
                    diff / 60000
                );

            box.innerHTML =

                "⏳ Berakhir dalam " +
                day + "h " +
                hour + "j " +
                minute + "m";

        });

} */

// =============================
// POPUP VOUCHER
// =============================
/* function gprOpenVoucherModal(voucher) {

    const title =
        voucher.dataset.title;

    const desc =
        voucher.dataset.desc;

    const code =
        voucher.dataset.code;

    const period =
        "Berlaku " +
        voucher.dataset.period;

    const minOrder =
        Number(
            voucher.dataset.minOrder
        ).toLocaleString("id-ID");

    const maxDiscount =
        Number(
            voucher.dataset.maxDiscount
        ).toLocaleString("id-ID");

    const terms =
        voucher.dataset.terms
            .split("|")
            .map(item =>
                `<li>${item}</li>`
            )
            .join("");


    document.getElementById(
        "gprVoucherModalBody"
    ).innerHTML = `

        <div class="gpr-modal-section">

            <h2>
                ${title}
            </h2>

            <p class="gpr-voucher-desc">
                ${desc}
            </p>

        </div>

        <div class="gpr-modal-section">

            <div class="gpr-modal-section-title">
                Kode Voucher
            </div>

            <div class="gpr-modal-code">
                ${code}
            </div>

        </div>

        <div class="gpr-modal-section">

            <div class="gpr-modal-section-title">
                Minimum Pembelian
            </div>

            <div>
                Rp${minOrder}
            </div>

        </div>

        <div class="gpr-modal-section">

            <div class="gpr-modal-section-title">
                Maksimum Diskon
            </div>

            <div>
                Rp${maxDiscount}
            </div>

        </div>

        <div class="gpr-modal-section">

            <div class="gpr-modal-section-title">
                Periode Promo
            </div>

            <div>
                ${period}
            </div>

        </div>

        <div class="gpr-modal-section">

            <div class="gpr-modal-section-title">
                Syarat & Ketentuan
            </div>

            <ul class="gpr-modal-terms">

                ${terms}

            </ul>

        </div>

        <button
            class="gpr-modal-copy-btn"
            onclick="gprCopyVoucherCode('${code}')">

            Salin Kode Voucher

        </button>

    `;

    document
        .getElementById(
            "gprVoucherModal"
        )
        .classList
        .add("show");

} */

// =============================
// TUTUP POPUP
// =============================
/* function gprCloseVoucherModal() {

    document
        .getElementById(
            "gprVoucherModal"
        )
        .classList
        .remove("show");

} */

// =============================
// SALIN DARI POPUP
// =============================
/* function gprCopyVoucherCode(code) {

    const input =
        document.createElement(
            "input"
        );

    input.value = code;

    document.body.appendChild(
        input
    );

    input.select();

    document.execCommand(
        "copy"
    );

    document.body.removeChild(
        input
    );

    const btn =
        document.querySelector(
            ".gpr-modal-copy-btn"
        );

    if (btn) {

        btn.innerHTML =
            "Tersalin ✓";

        setTimeout(function () {

            btn.innerHTML =
                "Salin Kode Voucher";

        }, 2000);

    }

    gprShowToast(

        "Kode voucher " +

        code +

        " berhasil disalin"

    );

} */

// =============================
// RENDER DATA VOUCHER
// =============================
/* function gprRenderVoucherData() {

    document
        .querySelectorAll(
            ".gpr-voucher-card"
        )

        .forEach(voucher => {

            voucher.style.background =
                voucher.dataset.cardColor;

            voucher
                .querySelector(
                    ".gpr-voucher-img"
                )
                .src =
                voucher.dataset.image;

            voucher
                .querySelector(
                    ".gpr-voucher-title"
                )
                .innerHTML =
                voucher.dataset.title;

            voucher
                .querySelector(
                    ".gpr-voucher-desc"
                )
                .innerHTML =
                voucher.dataset.desc;

            voucher
                .querySelector(
                    ".gpr-voucher-period"
                )
                .innerHTML =
                "Berlaku " +
                voucher.dataset.period;

        });

} */

// =============================
// INISIALISASI
// =============================
/*gprRenderVoucherData();

gprUpdateVoucherStatus();

gprUpdateCountdown();

// periksa setiap 1 menit
setInterval(function () {

    gprUpdateVoucherStatus();

    gprUpdateCountdown();

}, 60000); */

// =========================
// script pop up goces ai 
// =========================
function openGocesAI() {
    document.getElementById(
        "cyberPopupOverlay"
    ).style.display = "flex";
}

function closeGocesAI() {

    document.getElementById(
        "cyberPopupOverlay"
    ).style.display = "none";
}


// =========================
// script halaman shop
// =========================
let gcsFlashEnd = new Date("2026-06-27 23:59:59").getTime();

let gcsFlashInterval = setInterval(function () {

    let now = new Date().getTime();
    let distance = gcsFlashEnd - now;

    if (distance <= 0) {

        clearInterval(gcsFlashInterval);

        document.getElementById("gcsFlashSale").style.display = "none";

        return;
    }

    let jam = Math.floor(distance / (1000 * 60 * 60));
    let menit = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let detik = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("gcsFlashTimer").innerHTML =
        jam.toString().padStart(2, "0") + ":" +
        menit.toString().padStart(2, "0") + ":" +
        detik.toString().padStart(2, "0");

}, 1000);


// =========================
// script halaman profile beranda
// =========================
(function () {

    const KEY = "theme";

    // =========================
    // SAFE STORAGE (WebView proof)
    // =========================
    function getTheme() {
        try {
            return localStorage.getItem(KEY) || "light";
        } catch (e) {
            return "light";
        }
    }

    function setThemeStorage(theme) {
        try {
            localStorage.setItem(KEY, theme);
        } catch (e) { }
    }

    // =========================
    // APPLY THEME (CORE ENGINE)
    // =========================
    function applyTheme(theme) {

        document.documentElement.setAttribute("data-theme", theme);

        document.body.classList.toggle(
            "kpz-dark-mode",
            theme === "dark"
        );

        syncToggle(theme);
    }

    // =========================
    // SYNC TOGGLE UI
    // =========================
    function syncToggle(theme) {
        const toggle = document.getElementById("darkToggle");
        if (toggle) {
            toggle.checked = (theme === "dark");
        }
    }

    // =========================
    // PUBLIC SETTER
    // =========================
    function setTheme(theme) {
        setThemeStorage(theme);
        applyTheme(theme);
    }

    // =========================
    // SAFE INIT (ANTI ANDROID BUG)
    // =========================
    function initTheme() {

        const theme = getTheme();
        applyTheme(theme);

        const toggle = document.getElementById("darkToggle");

        if (toggle && !toggle.__bound) {

            toggle.__bound = true;

            toggle.addEventListener("change", function () {
                setTheme(this.checked ? "dark" : "light");
            });

        }
    }

    // =========================
    // MULTI-TRIGGER SYSTEM
    // =========================

    // 1. normal load
    document.addEventListener("DOMContentLoaded", initTheme);

    // 2. fallback kalau DOM telat / SPA
    window.addEventListener("load", initTheme);

    // 3. extra safety (WebView / iframe injection)
    setTimeout(initTheme, 300);
    setTimeout(initTheme, 1000);

    // expose global (biar bisa dipanggil dari page lain)
    window.setTheme = setTheme;

})();

// =========================
// script halaman orders
// =========================
function gakShowPage(page) {

    // sembunyikan semua isi tab
    document.querySelectorAll(".gak_page").forEach(item => {
        item.classList.remove("active");
    });

    // nonaktifkan semua tombol
    document.querySelectorAll(".gak_tab").forEach(item => {
        item.classList.remove("active");
    });

    // tampilkan halaman yang dipilih
    document
        .getElementById("page_" + page)
        .classList.add("active");

    // aktifkan tombol yang dipilih
    document
        .getElementById("btn_" + page)
        .classList.add("active");

}



// =========================
// script halaman home
// =========================
window.addEventListener(
    "message",
    function (event) {

        if (
            event.data.type === "emptyVoucher"
        ) {

            document.getElementById(
                "item-voucher"
            ).style.display = "none";

        }


        if (
            event.data.type === "voucherLoaded"
        ) {

            document.getElementById(
                "item-voucher"
            ).style.display = "block";

        }

    }
);