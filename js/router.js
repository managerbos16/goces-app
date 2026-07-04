/*==================================
  GOCES ROUTER v1.0
==================================*/

let currentPage = "home";
const pageHistory = [];

const pages = document.querySelectorAll(".goces-page");
const navItems = document.querySelectorAll(".goces-nav-item");

/*==================================
  Update Tampilan
==================================*/

function updateUI(pageId) {

    pages.forEach(page => {
        page.classList.remove("goces-active");
    });

    const target = document.getElementById(`page-${pageId}`);

    if (!target) {
        console.warn(`Halaman "${pageId}" tidak ditemukan.`);
        return false;
    }

    target.classList.add("goces-active");

    navItems.forEach(item => {
        item.classList.remove("goces-active");
    });

    const active = document.querySelector(`.goces-nav-item[data-page="${pageId}"]`);

    if (active) {
        active.classList.add("goces-active");
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

    return true;

}

/*==================================
  Buka Halaman
==================================*/

function showPage(pageId, saveHistory = true) {

    if (pageId === currentPage) return;

    if (saveHistory) {
        pageHistory.push(currentPage);
    }

    if (updateUI(pageId)) {
        currentPage = pageId;
    }

}

/*==================================
  Ganti Halaman Tanpa History
==================================*/

function replacePage(pageId) {

    if (updateUI(pageId)) {
        currentPage = pageId;
    }

}

/*==================================
  Tombol Back
==================================*/

function goBack() {

    if (pageHistory.length > 0) {

        const previousPage = pageHistory.pop();

        showPage(previousPage, false);

        return;

    }

    /* Sudah di halaman utama */

    if (typeof Jagel !== "undefined" && typeof Jagel.close === "function") {
        Jagel.close();
    }

}

/*==================================
  Reset History
==================================*/

function resetHistory() {

    pageHistory.length = 0;

}