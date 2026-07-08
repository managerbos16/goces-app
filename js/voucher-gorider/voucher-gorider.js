// ===================================================
// PENGATURAN VOUCHER GORIDE
// Tambahkan voucher baru di bawah ini
// ===================================================
const gcsVoucherGoRideData = [
    {
        title: "Gratis Ongkir",
        name: "GoRide",
        description: "Diskon hingga Rp20.000 untuk perjalanan GoRide.",
        code: "GORIDE20",
        start: "2026-07-01 00:00:00",
        end: "2026-07-31 23:59:59"
    },
    {
        title: "Gratis Ongkir",
        name: "GoRide Premium",
        description: "Diskon 50% untuk perjalanan GoRide Blue.",
        code: "GORIDEBLUE",
        start: "2026-07-01 00:00:00",
        end: "2026-08-30 23:59:59"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    gcsVoucherGoRideInit();
});

/**
 * Inisialisasi dan Render
 */
function gcsVoucherGoRideInit() {
    const container = document.getElementById("gcsVoucherGoRideContainer");
    const title = document.getElementById("gcsVoucherGoRideTitle");

    if (!container) return;

    const activeVouchers = gcsVoucherGoRideCheckSchedule(gcsVoucherGoRideData);

    // Jika tidak ada voucher, sembunyikan section
    if (activeVouchers.length === 0) {
        const section = document.querySelector(".gcsVoucherGoRideSection");
        if (section) {
            section.style.height = "0";
            section.style.margin = "0";
            section.style.padding = "0";
            section.style.overflow = "hidden";
        }
        title.classList.add("gcsVoucherGoRideHidden");
        return;
    }

    gcsVoucherGoRideRender(activeVouchers, container);
}

/**
 * Filter data berdasarkan tanggal (start <= now <= end)
 */
function gcsVoucherGoRideCheckSchedule(data) {
    const now = new Date().getTime();
    return data.filter(item => {
        const start = new Date(item.start.replace(/-/g, "/")).getTime();
        const end = new Date(item.end.replace(/-/g, "/")).getTime();
        return now >= start && now <= end;
    });
}

/**
 * Render Voucher ke DOM
 */
function gcsVoucherGoRideRender(vouchers, container) {
    vouchers.forEach(item => {
        const card = document.createElement("div");
        card.className = "gcsVoucherGoRideCard";

        card.innerHTML = `
      <div class="gcsVoucherGoRideLeft">
        <div class="gcsVoucherGoRideIcon">🛵</div>
        <div class="gcsVoucherGoRideContent">
          <p class="gcsVoucherGoRideName">${item.name}</p>
          <p class="gcsVoucherGoRideDesc">${item.description}</p>
        </div>
      </div>
      <div class="gcsVoucherGoRideDivider"></div>
      <div class="gcsVoucherGoRideRight">
        <div>
          <div class="gcsVoucherGoRideCode">${item.code}</div>
          <div class="gcsVoucherGoRideExpired">Berlaku sampai ${item.end.split(' ')[0]}</div>
        </div>
        <button class="gcsVoucherGoRideButton">Salin</button>
      </div>
    `;

        // Event Listener untuk Copy
        card.querySelector(".gcsVoucherGoRideButton").addEventListener("click", () => {
            gcsVoucherGoRideCopy(item.code);
        });

        container.appendChild(card);
    });
}

/**
 * Fungsi Copy (Kompatibel Android/Web)
 */
function gcsVoucherGoRideCopy(text) {
    // Metode modern
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            gcsVoucherGoRideShowToast("Kode voucher berhasil disalin.");
        });
    }
    // Fallback untuk WebView lama atau browser yang membatasi clipboard API
    else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            gcsVoucherGoRideShowToast("Kode voucher berhasil disalin.");
        } catch (err) {
            console.error("Gagal menyalin", err);
        }
        document.body.removeChild(textarea);
    }
}

/**
 * Menampilkan Toast
 */
function gcsVoucherGoRideShowToast(message) {
    const toast = document.getElementById("gprToast");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}