// Data voucher (Tetap di sini)
const gcsVoucherGoRideData = [
    {
        title: "Gratis Ongkir",
        name: "GoRide",
        description: "Diskon hingga Rp20.000 untuk perjalanan GoRide.",
        code: "GORIDE20",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsVoucherGoRideInit();
});

function gcsVoucherGoRideInit() {
    const container = document.getElementById("gcsVoucherGoRideContainer");
    const title = document.getElementById("gcsVoucherGoRideTitle");
    if (!container) return;
    const activeVouchers = gcsVoucherGoRideCheckSchedule(gcsVoucherGoRideData);
    if (activeVouchers.length === 0) {
        document.querySelector(".gcsVoucherGoRideSection").style.display = "none";
        return;
    }
    gcsVoucherGoRideRender(activeVouchers, container);
}

function gcsVoucherGoRideCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

function gcsVoucherGoRideRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsVoucherGoRideCard";

        // Struktur HTML Baru (Premium UI)
        card.innerHTML = `
            <div class="gcsVoucherGoRideLeft">
                <img src="https://res.cloudinary.com/dutuhbbg2/image/upload/v1781593613/ChatGPT_Image_16_Jun_2026_15.06.38_zw3ga1.png" class="gcsVoucherGoRideIcon" alt="GoRide">
                <div class="gcsVoucherGoRideContent">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <p class="gcsVoucherGoRideName">${item.name}</p>
                        <span class="gcsVoucherBadge">PROMO</span>
                    </div>
                    <p class="gcsVoucherGoRideDesc">${item.description}</p>
                </div>
            </div>
            <div class="gcsVoucherGoRideDivider"></div>
            <div class="gcsVoucherGoRideRight">
                <div>
                    <div class="gcsVoucherGoRideCode">${item.code}</div>
                    <div class="gcsVoucherGoRideExpired">📅 Berlaku s/d ${item.end.split(' ')[0]}</div>
                </div>
                <button class="gcsVoucherGoRideButton">Salin</button>
            </div>
        `;

        card.querySelector(".gcsVoucherGoRideButton").addEventListener("click", () => {
            gcsVoucherGoRideCopy(item.code);
        });

        container.appendChild(card);
    });
}

function gcsVoucherGoRideCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsVoucherGoRideShowToast("Kode voucher berhasil disalin.");
        });
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        gcsVoucherGoRideShowToast("Kode voucher berhasil disalin.");
    }
}

function gcsVoucherGoRideShowToast(message) {
    const toast = document.getElementById("gprToast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}