/**
 * DATA VOUCHER GOCAR
 * Tambahkan atau ubah data di bawah ini.
 */
const gcsVoucherGoCarData = [
    {
        name: "GoCar",
        description: "Diskon hingga Rp30.000 untuk perjalanan GoCar.",
        code: "GOCAR30",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsVoucherGoCarInit();
});

function gcsVoucherGoCarInit() {
    const container = document.getElementById("gcsVoucherGoCarContainer");
    const section = document.getElementById("gcsVoucherGoCarSection");

    if (!container || !section) return;

    // Filter voucher yang aktif
    const activeVouchers = gcsVoucherGoCarCheckSchedule(gcsVoucherGoCarData);

    // Auto-Hide Section jika tidak ada voucher
    if (activeVouchers.length === 0) {
        section.classList.add("gcsVoucherGoCarSectionHidden");
    } else {
        gcsVoucherGoCarRender(activeVouchers, container);
    }
}

function gcsVoucherGoCarCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

function gcsVoucherGoCarRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsVoucherGoCarCard";

        card.innerHTML = `
            <div class="gcsVoucherGoCarLeft">
                <img src="https://res.cloudinary.com/dutuhbbg2/image/upload/v1781594742/ChatGPT_Image_16_Jun_2026_15.10.13_czsgh3.png" class="gcsVoucherGoCarIcon" alt="GoCar">
                <div class="gcsVoucherGoCarContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                        <p class="gcsVoucherGoCarName">${item.name}</p>
                        <span class="gcsVoucherGoCarBadge">PROMO</span>
                    </div>
                    <p class="gcsVoucherGoCarDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsVoucherGoCarDivider"></div>
            <div class="gcsVoucherGoCarRight">
                <div>
                    <div class="gcsVoucherGoCarCode">${item.code}</div>
                    <div class="gcsVoucherGoCarExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsVoucherGoCarButton">Salin</button>
            </div>
        `;

        // Event Listener untuk Copy
        card.querySelector(".gcsVoucherGoCarButton").addEventListener("click", () => {
            gcsVoucherGoCarCopy(item.code);
        });

        container.appendChild(card);
    });
}

function gcsVoucherGoCarCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsVoucherGoCarShowToast("Kode voucher berhasil disalin.");
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
            gcsVoucherGoCarShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

function gcsVoucherGoCarShowToast(message) {
    const toast = document.getElementById("gprToast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}