/**
 * DATA VOUCHER FRESH
 * Tambahkan atau ubah data voucher di sini.
 */
const gcsVoucherFreshData = [
    {
        name: "Fresh",
        description: "Diskon hingga Rp35.000 untuk belanja kebutuhan segar.",
        code: "FRESH35",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsVoucherFreshInit();
});

function gcsVoucherFreshInit() {
    const container = document.getElementById("gcsVoucherFreshContainer");
    const section = document.getElementById("gcsVoucherFreshSection");

    if (!container || !section) return;

    // Filter voucher aktif
    const activeVouchers = gcsVoucherFreshCheckSchedule(gcsVoucherFreshData);

    // Auto-Hide Section jika kosong
    if (activeVouchers.length === 0) {
        section.classList.add("gcsVoucherFreshSectionHidden");
    } else {
        gcsVoucherFreshRender(activeVouchers, container);
    }
}

function gcsVoucherFreshCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

function gcsVoucherFreshRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsVoucherFreshCard";

        card.innerHTML = `
            <div class="gcsVoucherFreshLeft">
                <img src="images/fresh.png" class="gcsVoucherFreshIcon" alt="Fresh">
                <div class="gcsVoucherFreshContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                        <p class="gcsVoucherFreshName">${item.name}</p>
                        <span class="gcsVoucherFreshBadge">PROMO</span>
                    </div>
                    <p class="gcsVoucherFreshDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsVoucherFreshDivider"></div>
            <div class="gcsVoucherFreshRight">
                <div>
                    <div class="gcsVoucherFreshCode">${item.code}</div>
                    <div class="gcsVoucherFreshExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsVoucherFreshButton">Salin</button>
            </div>
        `;

        // Event Listener untuk Copy
        card.querySelector(".gcsVoucherFreshButton").addEventListener("click", () => {
            gcsVoucherFreshCopy(item.code);
        });

        container.appendChild(card);
    });
}

function gcsVoucherFreshCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsVoucherFreshShowToast("Kode voucher berhasil disalin.");
        });
    } else {
        // Fallback untuk WebView/Browser lama
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            gcsVoucherFreshShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

function gcsVoucherFreshShowToast(message) {
    const toast = document.getElementById("gprToast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}