/*==================================
        CONFIG
==================================*/

const API_BASE = "https://goces-api.vercel.app/api";

let payment =
    window.currentPayment || null;

let reference =
    window.currentReference || null;

let countdownInterval = null;
let statusInterval = null;

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            maximumFractionDigits: 0

        }

    ).format(Number(number) || 0);

}

/*==================================
        LOAD PAYMENT
==================================*/

async function loadPayment() {
    payment = window.currentPayment || payment;
    reference = window.currentReference || reference;

    try {

        if (!reference) {

            alert("Data pembayaran tidak ditemukan.");

            showPage("goces-payment");

            return;

        }

        if (!payment) {

            const response = await fetch(

                API_BASE +
                "/payment/detail/" +
                encodeURIComponent(reference)

            );

            const json =
                await response.json();

            if (!json.success) {

                throw new Error(

                    json.message ||

                    "Pembayaran tidak ditemukan."

                );

            }

            payment = json.data;

            window.currentPayment =
                payment;

        }

        document.getElementById(

            "gwaitLoading"

        ).style.display = "none";

        document.getElementById(

            "gwaitContent"

        ).style.display = "block";

        document.getElementById(

            "gwaitAmount"

        ).textContent =

            formatRupiah(payment.amount);

        document.getElementById(

            "gwaitMethod"

        ).textContent =

            payment.payment_name ||
            "QRIS";

        document.getElementById(

            "gwaitReference"

        ).textContent =

            payment.reference;

        document.getElementById(

            "gwaitQR"

        ).src =

            payment.qr_url;

        buildInstructions(

            payment.instructions || []

        );

        updateStatus(

            payment.status

        );

        startCountdown(

            payment.expired_time

        );

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/*==================================
        STATUS
==================================*/

function updateStatus(status) {

    const badge =

        document.getElementById(

            "gwaitStatusBadge"

        );

    badge.textContent = status;

    switch (status) {

        case "PAID":

            badge.style.background =
                "#16a34a";

            break;

        case "EXPIRED":

            badge.style.background =
                "#dc2626";

            break;

        default:

            badge.style.background =
                "#f59e0b";

    }

}

/*==================================
        INSTRUCTIONS
==================================*/

function buildInstructions(data) {

    const container =

        document.getElementById(

            "gwaitInstructions"

        );

    container.innerHTML = "";

    data.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "gwait-step";

        let html =
            "<h4>" +
            item.title +
            "</h4><ol>";

        item.steps.forEach(step => {

            html +=
                "<li>" +
                step +
                "</li>";

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

    clearInterval(

        countdownInterval

    );

    countdownInterval =

        setInterval(() => {

            const now =

                Math.floor(

                    Date.now() / 1000

                );

            const diff =
                expiredTime - now;

            if (diff <= 0) {

                clearInterval(

                    countdownInterval

                );

                document.getElementById(

                    "gwaitCountdown"

                ).textContent =

                    "00:00:00";

                return;

            }

            const h =

                Math.floor(

                    diff / 3600

                );

            const m =

                Math.floor(

                    (diff % 3600) / 60

                );

            const s =

                diff % 60;

            document.getElementById(

                "gwaitCountdown"

            ).textContent =

                String(h).padStart(2, "0") +
                ":" +
                String(m).padStart(2, "0") +
                ":" +
                String(s).padStart(2, "0");

        }, 1000);

}

/*==================================
        CHECK STATUS
==================================*/

async function checkStatus() {

    try {

        if (!reference) {

            return;

        }

        const response = await fetch(

            API_BASE +
            "/payment/detail/" +
            encodeURIComponent(reference)

        );

        const json =
            await response.json();

        if (!json.success) {

            return;

        }

        payment =
            json.data;

        window.currentPayment =
            payment;

        updateStatus(

            payment.status

        );

        /*==============================
                PAID
        ==============================*/

        if (payment.status === "PAID") {

            clearInterval(

                statusInterval

            );

            clearInterval(

                countdownInterval

            );

            window.currentPayment =
                payment;

            window.currentReference =
                payment.reference;

            showPage("goces-success");

            if (typeof loadDonationSuccess === "function") {
                loadDonationSuccess();
            }

            return;


        }

        /*==============================
                EXPIRED
        ==============================*/

        if (payment.status === "EXPIRED") {

            clearInterval(

                statusInterval

            );

            clearInterval(

                countdownInterval

            );

            alert("Pembayaran telah kedaluwarsa.");

            showPage("goces-payment");

            return;

        }

    }

    catch (err) {

        console.error(err);

    }

}

/*==================================
        DOWNLOAD QR
==================================*/

document.getElementById(

    "gwaitDownload"

).onclick = function () {

    const qr =

        document.getElementById(

            "gwaitQR"

        ).src;

    if (!qr) {

        return;

    }

    const link =

        document.createElement("a");

    link.href = qr;

    link.download =

        "QRIS-GOCES.png";

    document.body.appendChild(

        link

    );

    link.click();

    document.body.removeChild(

        link

    );

};

/*==================================
        START
==================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadPayment();

        statusInterval =

            setInterval(

                checkStatus,

                5000

            );

    }

);

/*==================================
        CLEANUP
==================================*/

window.addEventListener(

    "beforeunload",

    function () {

        clearInterval(

            countdownInterval

        );

        clearInterval(

            statusInterval

        );

    }

);