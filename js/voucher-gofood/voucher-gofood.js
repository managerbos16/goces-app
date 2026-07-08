/**
 * DATA VOUCHER GOFOOD
 * Tambahkan atau ubah data voucher di sini.
 */
const gcsGoFoodVoucherData = [
    {
        name: "GoFood",
        description: "Diskon hingga Rp50.000 untuk pembelian makanan.",
        code: "GOFOOD50",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsGoFoodVoucherInit();
});

function gcsGoFoodVoucherInit() {
    const container = document.getElementById("gcsGoFoodVoucherContainer");
    const section = document.getElementById("gcsGoFoodVoucherSection");

    if (!container || !section) return;

    // Filter voucher aktif
    const activeVouchers = gcsGoFoodVoucherCheckSchedule(gcsGoFoodVoucherData);

    // Auto-Hide Section jika kosong
    if (activeVouchers.length === 0) {
        section.classList.add("gcsGoFoodVoucherSectionHidden");
    } else {
        gcsGoFoodVoucherRender(activeVouchers, container);
    }
}

function gcsGoFoodVoucherCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

function gcsGoFoodVoucherRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsGoFoodVoucherCard";

        card.innerHTML = `
            <div class="gcsGoFoodVoucherLeft">
                <img src="images/gofood.png" class="gcsGoFoodVoucherIcon" alt="GoFood">
                <div class="gcsGoFoodVoucherContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                        <p class="gcsGoFoodVoucherName">${item.name}</p>
                        <span class="gcsGoFoodVoucherBadge">PROMO</span>
                    </div>
                    <p class="gcsGoFoodVoucherDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsGoFoodVoucherDivider"></div>
            <div class="gcsGoFoodVoucherRight">
                <div>
                    <div class="gcsGoFoodVoucherCode">${item.code}</div>
                    <div class="gcsGoFoodVoucherExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsGoFoodVoucherButton">Salin</button>
            </div>
        `;

        // Event Listener untuk Copy
        card.querySelector(".gcsGoFoodVoucherButton").addEventListener("click", () => {
            gcsGoFoodVoucherCopy(item.code);
        });

        container.appendChild(card);
    });
}

function gcsGoFoodVoucherCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsGoFoodVoucherShowToast("Kode voucher berhasil disalin.");
        });
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            gcsGoFoodVoucherShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

function gcsGoFoodVoucherShowToast(message) {
    const toast = document.getElementById("gprToast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}