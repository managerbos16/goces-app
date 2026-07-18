(() => {

    const API_BASE = "https://goces-api.vercel.app/api";

    let payment =
        window.currentPayment || null;

    let reference =
        window.currentReference || null;

    // Dipakai bersama agar tidak ada interval baru jika script termuat ulang.
    const paymentMonitor = window.gocesPaymentMonitor || {
        countdownInterval: null,
        statusInterval: null,
        isCheckingStatus: false
    };

    window.gocesPaymentMonitor = paymentMonitor;

    function stopPaymentMonitor() {
        clearInterval(paymentMonitor.countdownInterval);
        clearInterval(paymentMonitor.statusInterval);

        paymentMonitor.countdownInterval = null;
        paymentMonitor.statusInterval = null;
        paymentMonitor.isCheckingStatus = false;
    }

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
        stopPaymentMonitor();
        payment = window.currentPayment || payment;
        reference = window.currentReference || reference;
        document.getElementById("gwaitLoading").style.display = "block";
        document.getElementById("gwaitContent").style.display = "none";

        try {

            if (!reference) {

                window.currentPayment = null;
                window.currentReference = null;

                alert("Pembayaran telah kedaluwarsa.");

                showPage("goces-payment");

                if (typeof loadCampaign === "function") {
                    loadCampaign();
                }

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

            renderPaymentGuide(payment);

            buildInstructions(
                payment.instructions || []
            );

            updateStatus(

                payment.status

            );

            startCountdown(
                payment.expired_time
            );

            // Tetap cek setiap 5 detik, tetapi hanya satu interval yang aktif.
            paymentMonitor.statusInterval = setInterval(checkStatus, 5000);

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


    function renderPaymentGuide(payment) {
        const qrCard = document.getElementById("gwaitQrCard");
        const qrImage = document.getElementById("gwaitQR");
        const downloadButton = document.getElementById("gwaitDownload");

        const codeCard = document.getElementById("gwaitCodeCard");
        const codeTitle = document.getElementById("gwaitCodeTitle");
        const codeElement = document.getElementById("gwaitPaymentCode");

        const payLinkCard = document.getElementById("gwaitPayLinkCard");
        const payLink = document.getElementById("gwaitPayLink");

        const qrUrl = payment.qr_url || "";
        const paymentCode =
            payment.pay_code ||
            payment.payment_code ||
            "";

        const paymentLink =
            payment.pay_url ||
            payment.checkout_url ||
            "";

        // QRIS
        if (qrUrl) {
            qrCard.style.display = "block";
            qrImage.src = qrUrl;
            downloadButton.style.display = "block";
        } else {
            qrCard.style.display = "none";
            qrImage.removeAttribute("src");
        }

        // Virtual Account, Alfamart, Indomaret, dan metode berkode lainnya.
        if (paymentCode) {
            codeCard.style.display = "block";

            codeTitle.textContent =
                payment.payment_name ||
                "Kode Pembayaran";

            codeElement.textContent = paymentCode;
        } else {
            codeCard.style.display = "none";
            codeElement.textContent = "";
        }

        // E-wallet atau channel yang menggunakan halaman pembayaran Tripay.
        if (paymentLink && !qrUrl) {
            payLinkCard.style.display = "block";
            payLink.href = paymentLink;
        } else {
            payLinkCard.style.display = "none";
            payLink.removeAttribute("href");
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

        clearInterval(paymentMonitor.countdownInterval);

        paymentMonitor.countdownInterval =
            setInterval(() => {

                const now =

                    Math.floor(

                        Date.now() / 1000

                    );

                const diff =
                    expiredTime - now;

                if (diff <= 0) {

                    clearInterval(paymentMonitor.countdownInterval);
                    paymentMonitor.countdownInterval = null;

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
        const waitingPage = document.getElementById("page-goces-waiting");

        // Jika pengguna sudah keluar dari halaman QRIS, hentikan polling.
        if (!waitingPage || !waitingPage.classList.contains("active")) {
            stopPaymentMonitor();
            return;
        }

        // Jangan mulai request baru bila request sebelumnya belum selesai.
        if (paymentMonitor.isCheckingStatus || !reference) {
            return;
        }

        paymentMonitor.isCheckingStatus = true;

        try {
            const response = await fetch(
                API_BASE +
                "/payment/detail/" +
                encodeURIComponent(reference)
            );

            const json = await response.json();

            // Pengguna mungkin berpindah halaman saat request sedang berjalan.
            if (!waitingPage.classList.contains("active") || !json.success) {
                return;
            }

            payment = json.data;
            window.currentPayment = payment;

            updateStatus(payment.status);

            if (payment.status === "PAID") {
                stopPaymentMonitor();

                window.currentPayment = payment;
                window.currentReference = payment.reference;

                showPage("goces-success");

                if (typeof loadDonation === "function") {
                    loadDonation();
                }

                return;
            }

            if (payment.status === "EXPIRED") {
                stopPaymentMonitor();

                alert("Pembayaran telah kedaluwarsa.");
                showPage("goces-payment");
            }

        } catch (err) {
            console.error(err);

        } finally {
            paymentMonitor.isCheckingStatus = false;
        }
    }

    /*==================================
         DOWNLOAD QR
 ==================================*/

    const downloadButton = document.getElementById("gwaitDownload");

    if (downloadButton) {

        downloadButton.onclick = function () {

            const qr = document.getElementById("gwaitQR").src;

            if (!qr) {

                return;

            }

            const link = document.createElement("a");

            link.href = qr;

            link.download = "QRIS-GOCES.png";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        };

    }

    const copyCodeButton = document.getElementById("gwaitCopyCode");

    if (copyCodeButton) {
        copyCodeButton.onclick = async function () {
            const paymentCode =
                document.getElementById("gwaitPaymentCode")
                    .textContent
                    .trim();

            if (!paymentCode || paymentCode === "-") {
                return;
            }

            try {
                await navigator.clipboard.writeText(paymentCode);

                const originalText = copyCodeButton.textContent;

                copyCodeButton.textContent = "Kode Berhasil Disalin";

                setTimeout(function () {
                    copyCodeButton.textContent = originalText;
                }, 2000);

            } catch (err) {
                console.error(err);
                alert("Kode pembayaran: " + paymentCode);
            }
        };
    }

    /*==================================
            CLEANUP
    ==================================*/

    window.addEventListener("beforeunload", stopPaymentMonitor);

    window.loadPayment = loadPayment;

})();