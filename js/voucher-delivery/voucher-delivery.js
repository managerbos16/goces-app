/**
 * DATA VOUCHER DELIVERY
 * Tambahkan atau ubah data voucher di sini.
 */
const gcsDeliveryVoucherData = [
    {
        name: "Delivery",
        description: "Gratis ongkir hingga Rp25.000 untuk layanan Delivery.",
        code: "DELIVERY25",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsDeliveryVoucherInit();
});

function gcsDeliveryVoucherInit() {
    const container = document.getElementById("gcsDeliveryVoucherContainer");
    const section = document.getElementById("gcsDeliveryVoucherSection");

    if (!container || !section) return;

    // Filter voucher aktif
    const activeVouchers = gcsDeliveryVoucherCheckSchedule(gcsDeliveryVoucherData);

    // Auto-Hide Section jika kosong
    if (activeVouchers.length === 0) {
        section.classList.add("gcsDeliveryVoucherSectionHidden");
    } else {
        gcsDeliveryVoucherRender(activeVouchers, container);
    }
}

function gcsDeliveryVoucherCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

function gcsDeliveryVoucherRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsDeliveryVoucherCard";

        card.innerHTML = `
            <div class="gcsDeliveryVoucherLeft">
                <img src="images/delivery.png" class="gcsDeliveryVoucherIcon" alt="Delivery">
                <div class="gcsDeliveryVoucherContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                        <p class="gcsDeliveryVoucherName">${item.name}</p>
                        <span class="gcsDeliveryVoucherBadge">PROMO</span>
                    </div>
                    <p class="gcsDeliveryVoucherDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsDeliveryVoucherDivider"></div>
            <div class="gcsDeliveryVoucherRight">
                <div>
                    <div class="gcsDeliveryVoucherCode">${item.code}</div>
                    <div class="gcsDeliveryVoucherExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsDeliveryVoucherButton">Salin</button>
            </div>
        `;

        // Event Listener untuk Copy
        card.querySelector(".gcsDeliveryVoucherButton").addEventListener("click", () => {
            gcsDeliveryVoucherCopy(item.code);
        });

        container.appendChild(card);
    });
}

function gcsDeliveryVoucherCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsDeliveryVoucherShowToast("Kode voucher berhasil disalin.");
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
            gcsDeliveryVoucherShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

function gcsDeliveryVoucherShowToast(message) {
    const toast = document.getElementById("gprToast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}