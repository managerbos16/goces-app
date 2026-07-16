const SIDEBAR_MENU = [

    {
        id: "dashboard",
        label: "Dashboard",
        icon: "fa-chart-pie"
    },

    {
        id: "merchant",
        label: "Merchant",
        icon: "fa-store"
    },

    {
        id: "pembayaran",
        label: "Pembayaran",
        icon: "fa-credit-card"
    },

    {
        id: "withdraw",
        label: "Withdrawal",
        icon: "fa-wallet"
    },

    {
        id: "voucher",
        label: "Voucher Promo",
        icon: "fa-ticket"
    },

    {
        id: "banner",
        label: "Banner Promosi",
        icon: "fa-image"
    },

    {
        id: "pengaturan",
        label: "Pengaturan Sistem",
        icon: "fa-gear"
    },

    {
        id: "admin",
        label: "Hak Akses & Admin",
        icon: "fa-user-shield"
    }

];

// =====================================
// BUILD SIDEBAR
// =====================================

function buildDynamicSidebar() {

    const user =
        JSON.parse(localStorage.getItem("admin"));

    if (!user) {

        console.error("Data admin tidak ditemukan.");

        return;

    }

    const menuContainer =
        document.getElementById("dynamic-sidebar-menu");

    if (!menuContainer) {

        console.error("Container sidebar tidak ditemukan.");

        return;

    }

    const permissions =
        user.permissions || {};

    let html = "";

    let firstMenu = null;

    SIDEBAR_MENU.forEach(menu => {

        if (!permissions[menu.id]) return;

        if (!firstMenu) {

            firstMenu = menu.id;

        }

        html += `

        <a
            href="#"
            class="menu-item"
            id="nav-${menu.id}"
            onclick="switchWorkspace('${menu.id}')">

            <i class="fa-solid ${menu.icon}"></i>

            <span>${menu.label}</span>

        </a>

        `;

    });

    html += `

    <a
        href="#"
        class="menu-item logout-btn"
        onclick="triggerSecureLogout()">

        <i class="fa-solid fa-right-from-bracket"></i>

        <span>Keluar Portal</span>

    </a>

    `;

    menuContainer.innerHTML = html;

    if (firstMenu) {

        switchWorkspace(firstMenu);

    }

}

// =====================================
// SIDEBAR MOBILE
// =====================================

function openSidebar() {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (sidebar) {
        sidebar.classList.add("show");
    }

    if (overlay) {
        overlay.classList.add("show");
    }

}

function closeSidebar() {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (sidebar) {
        sidebar.classList.remove("show");
    }

    if (overlay) {
        overlay.classList.remove("show");
    }

}

// =====================================
// INIT SIDEBAR
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("sidebar-toggle");
    const close = document.getElementById("sidebar-close");
    const overlay = document.getElementById("sidebar-overlay");

    if (toggle) {
        toggle.addEventListener("click", openSidebar);
    }

    if (close) {
        close.addEventListener("click", closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeSidebar();

        }

    });

});