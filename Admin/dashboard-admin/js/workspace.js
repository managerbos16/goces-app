
async function switchWorkspace(target) {

    // Ambil data user yang sedang login
    const sessionData = sessionStorage.getItem("authenticated_user");

    if (!sessionData) {
        triggerSecureLogout();
        return;
    }

    const user = JSON.parse(sessionData);

    const permissions = user.permissions || {};

    if (!permissions[target]) {

        showNotification(
            "Akses Ditolak: Anda tidak memiliki hak akses."
        );

        return;

    }

    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    const targetNav = document.getElementById(`nav-${target}`);
    if (targetNav) targetNav.classList.add('active');

    const viewContainer = document.getElementById('workspace-view');
    document.getElementById('page-title').innerText = target.charAt(0).toUpperCase() + target.slice(1);

    startSessionTimeout(); // Reset timer aktivitas sesi pengguna

    if (target === "dashboard") {
        await loadModule("dashboard");
        loadDashboard();
        closeSidebar();
    }

    else if (target === "merchant") {
        await loadModule("merchant");
        loadMerchants();
        closeSidebar();
    }

    else if (target === "pembayaran") {
        await loadModule("pembayaran");
        loadPembayaran();
        closeSidebar();
    }

    else if (target === "withdraw") {
        await loadModule("withdraw");
        loadWithdraw();
        closeSidebar();
    }

    else if (target === "voucher") {
        await loadModule("voucher");
        loadVoucher();
        closeSidebar();
    }

    else if (target === "banner") {
        await loadModule("banner");
        loadBanner();
        closeSidebar();
    }

    else if (target === "pengaturan") {
        await loadModule("pengaturan");
        loadPengaturan();
        closeSidebar();
    }

    else if (target === "admin") {
        await loadModule("admin");
        loadAdmin();
        closeSidebar();
        renderRbacWorkspace(
            document.getElementById("workspace-view")
        );

    }
}