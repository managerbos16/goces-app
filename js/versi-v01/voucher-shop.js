/**
 * DATA VOUCHER SHOP
 * Tambahkan atau ubah data voucher di sini.
 */
const gcsVoucherShopData = [
    {
        name: "Shop",
        description: "Diskon hingga Rp40.000 untuk pembelian melalui GoShop.",
        code: "SHOP40",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsVoucherShopInit();
});

function gcsVoucherShopInit() {
    const container = document.getElementById("gcsVoucherShopContainer");
    const section = document.getElementById("gcsVoucherShopSection");

    if (!container || !section) return;

    // Filter voucher aktif
    const activeVouchers = gcsVoucherShopCheckSchedule(gcsVoucherShopData);

    // Auto-Hide Section jika kosong
    if (activeVouchers.length === 0) {
        section.classList.add("gcsVoucherShopSectionHidden");
    } else {
        gcsVoucherShopRender(activeVouchers, container);
    }
}

function gcsVoucherShopCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

function gcsVoucherShopRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsVoucherShopCard";

        card.innerHTML = `
            <div class="gcsVoucherShopLeft">
                <img src="images/shop.png" class="gcsVoucherShopIcon" alt="Shop">
                <div class="gcsVoucherShopContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                        <p class="gcsVoucherShopName">${item.name}</p>
                        <span class="gcsVoucherShopBadge">PROMO</span>
                    </div>
                    <p class="gcsVoucherShopDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsVoucherShopDivider"></div>
            <div class="gcsVoucherShopRight">
                <div>
                    <div class="gcsVoucherShopCode">${item.code}</div>
                    <div class="gcsVoucherShopExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsVoucherShopButton">Salin</button>
            </div>
        `;

        // Event Listener untuk Copy
        card.querySelector(".gcsVoucherShopButton").addEventListener("click", () => {
            gcsVoucherShopCopy(item.code);
        });

        container.appendChild(card);
    });
}

function gcsVoucherShopCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsVoucherShopShowToast("Kode voucher berhasil disalin.");
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
            gcsVoucherShopShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

function gcsVoucherShopShowToast(message) {
    const toast = document.getElementById("gprToast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}