/*==================================
        CONFIG
==================================*/

const API_BASE = "http://localhost:3000/api";

const params = new URLSearchParams(window.location.search);

const reference = params.get("reference");

let countdownInterval = null;

let statusInterval = null;

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return "Rp" + Number(number).toLocaleString("id-ID");

}

/*==================================
        LOAD PAYMENT
==================================*/

async function loadPayment() {

    try {

        const response = await fetch(

            `${API_BASE}/payment/detail/${reference}`

        );

        const json = await response.json();

        if (!json.success) {

            throw new Error(json.message);

        }

        const payment = json.data;

        document.getElementById("gwaitLoading").style.display = "none";

        document.getElementById("gwaitContent").style.display = "block";

        document.getElementById("gwaitAmount").textContent =

            formatRupiah(payment.amount);

        document.getElementById("gwaitMethod").textContent =

            payment.payment_name;

        document.getElementById("gwaitReference").textContent =

            payment.reference;

        document.getElementById("gwaitQR").src =

            payment.qr_url;

        buildInstructions(payment.instructions || []);

        updateStatus(payment.status);

        startCountdown(payment.expired_time);

    }

    catch (err) {

        alert(err.message);

        console.error(err);

    }

}

/*==================================
        STATUS
==================================*/

function updateStatus(status) {

    const badge = document.getElementById("gwaitStatusBadge");

    badge.textContent = status;

    if (status === "PAID") {

        badge.style.background = "#16a34a";

    }

    else if (status === "EXPIRED") {

        badge.style.background = "#dc2626";

    }

    else {

        badge.style.background = "#f59e0b";

    }

}

/*==================================
        INSTRUCTIONS
==================================*/

function buildInstructions(data) {

    const container = document.getElementById("gwaitInstructions");

    container.innerHTML = "";

    data.forEach(item => {

        const div = document.createElement("div");

        div.className = "gwait-step";

        let html = `<h4>${item.title}</h4><ol>`;

        item.steps.forEach(step => {

            html += `<li>${step}</li>`;

        });

        html += "</ol>";

        div.innerHTML = html;

        container.appendChild(div);

    });

}

/*==================================
        COUNTDOWN
==================================*/

function startCountdown(expiredTime) {

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {

        const now = Math.floor(Date.now() / 1000);

        const diff = expiredTime - now;

        if (diff <= 0) {

            clearInterval(countdownInterval);

            document.getElementById("gwaitCountdown").textContent =

                "00:00:00";

            return;

        }

        const h = Math.floor(diff / 3600);

        const m = Math.floor((diff % 3600) / 60);

        const s = diff % 60;

        document.getElementById("gwaitCountdown").textContent =

            String(h).padStart(2, "0") + ":" +

            String(m).padStart(2, "0") + ":" +

            String(s).padStart(2, "0");

    }, 1000);

}

/*==================================
        CHECK STATUS
==================================*/

async function checkStatus() {

    try {

        const response = await fetch(

            `${API_BASE}/payment/detail/${reference}`

        );

        const json = await response.json();

        if (!json.success) {

            return;

        }

        const payment = json.data;

        updateStatus(payment.status);

        if (payment.status === "PAID") {

            clearInterval(statusInterval);

            clearInterval(countdownInterval);

            location.href =

                "../success/success.html?reference=" +

                encodeURIComponent(reference);

        }

    }

    catch (err) {

        console.error(err);

    }

}

/*==================================
        DOWNLOAD QR
==================================*/

document.getElementById("gwaitDownload")

    .onclick = () => {

        window.open(

            document.getElementById("gwaitQR").src,

            "_blank"

        );

    };

/*==================================
        START
==================================*/

loadPayment();

statusInterval = setInterval(

    checkStatus,

    5000

);