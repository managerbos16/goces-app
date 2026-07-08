/**
 * DATA VOUCHER PPOB
 * Tambahkan atau ubah data voucher di sini.
 */
const gcsPpobVoucherData = [
    {
        name: "PPOB",
        description: "Diskon hingga Rp20.000 untuk pembayaran Pulsa, PLN, BPJS, PDAM, dan layanan PPOB lainnya.",
        code: "PPOB20",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsPpobVoucherInit();
});

/**
 * Inisialisasi awal
 */
function gcsPpobVoucherInit() {
    const container = document.getElementById("gcsPpobVoucherContainer");
    const section = document.getElementById("gcsPpobVoucherSection");

    if (!container || !section) return;

    // Filter voucher yang masih aktif
    const activeVouchers = gcsPpobVoucherCheckSchedule(gcsPpobVoucherData);

    // Auto-Hide Section jika tidak ada voucher
    if (activeVouchers.length === 0) {
        section.classList.add("gcsPpobVoucherSectionHidden");
    } else {
        gcsPpobVoucherRender(activeVouchers, container);
    }
}

/**
 * Fungsi filter berdasarkan tanggal
 */
function gcsPpobVoucherCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

/**
 * Render voucher ke dalam HTML
 */
function gcsPpobVoucherRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsPpobVoucherCard";

        card.innerHTML = `
            <div class="gcsPpobVoucherLeft">
                <img src="images/ppob.png" class="gcsPpobVoucherIcon" alt="PPOB">
                <div class="gcsPpobVoucherContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                        <p class="gcsPpobVoucherName">${item.name}</p>
                        <span class="gcsPpobVoucherBadge">PROMO</span>
                    </div>
                    <p class="gcsPpobVoucherDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsPpobVoucherDivider"></div>
            <div class="gcsPpobVoucherRight">
                <div>
                    <div class="gcsPpobVoucherCode">${item.code}</div>
                    <div class="gcsPpobVoucherExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsPpobVoucherButton">Salin</button>
            </div>
        `;

        // Event Listener untuk tombol copy
        card.querySelector(".gcsPpobVoucherButton").addEventListener("click", () => {
            gcsPpobVoucherCopy(item.code);
        });

        container.appendChild(card);
    });
}

/**
 * Fungsi Copy Kode Voucher
 */
function gcsPpobVoucherCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsPpobVoucherShowToast("Kode voucher berhasil disalin.");
        });
    } else {
        // Fallback untuk WebView
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            gcsPpobVoucherShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

/**
 * Menampilkan Toast
 */
function gcsPpobVoucherShowToast(message) {
    const toast = document.getElementById("gprToast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}