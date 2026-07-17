/*==================================
        CONFIG
==================================*/

const API_BASE = "http://localhost:3000/api";

/*==================================
        URL PARAMETER
==================================*/

const params = new URLSearchParams(window.location.search);

const campaignId = params.get("id");

let campaign = null;

/*==================================
        FORMAT RUPIAH
==================================*/

function formatRupiah(number) {

    return "Rp" + Number(number).toLocaleString("id-ID");

}

/*==================================
        LOAD CAMPAIGN
==================================*/

async function loadCampaign() {

    try {

        const response = await fetch(

            `${API_BASE}/campaigns/${campaignId}`

        );

        const json = await response.json();

        if (!json.success) {

            throw new Error(json.message);

        }

        campaign = json.data;

        document.getElementById("gpayLoading").style.display = "none";

        document.getElementById("gpayContent").style.display = "block";

        document.getElementById("gpayImage").src =
            campaign.cover_image;

        document.getElementById("gpayTitle").textContent =
            campaign.title;

        document.getElementById("gpayTarget").textContent =
            "Target " +
            formatRupiah(campaign.target_amount);

    }

    catch (err) {

        alert(err.message);

        console.error(err);

    }

}

/*==================================
        UPDATE TOTAL
==================================*/

function updateTotal() {

    const amount = Number(

        document.getElementById("donationAmount").value || 0

    );

    document.getElementById("gpayTotal").textContent =

        formatRupiah(amount);

}

/*==================================
        QUICK BUTTON
==================================*/

document.querySelectorAll(".gpay-quick button")

    .forEach(button => {

        button.onclick = () => {

            document.getElementById("donationAmount").value =

                button.dataset.value;

            updateTotal();

        };

    });

/*==================================
        INPUT NOMINAL
==================================*/

document.getElementById("donationAmount")

    .addEventListener(

        "input",

        updateTotal

    );

/*==================================
        SUBMIT DONATION
==================================*/

document.getElementById("gpaySubmit")

    .onclick = async () => {

        const donor_name =

            document.getElementById("donorName")

                .value.trim();

        const donor_email =

            document.getElementById("donorEmail")

                .value.trim();

        const donor_phone =

            document.getElementById("donorPhone")

                .value.trim();

        const amount = Number(

            document.getElementById("donationAmount")

                .value

        );

        const is_anonymous =

            document.getElementById("isAnonymous")

                .checked;

        if (!donor_name) {

            return alert("Nama wajib diisi.");

        }

        if (!donor_email) {

            return alert("Email wajib diisi.");

        }

        if (!donor_phone) {

            return alert("Nomor WhatsApp wajib diisi.");

        }

        if (amount < 10000) {

            return alert(

                "Minimal donasi Rp10.000"

            );

        }

        try {

            document.getElementById("gpaySubmit").disabled = true;

            document.getElementById("gpaySubmit").textContent =

                "Memproses...";

            const response = await fetch(

                `${API_BASE}/donations/create`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":

                            "application/json"

                    },

                    body: JSON.stringify({

                        campaign_id: campaign.id,

                        title: campaign.title,

                        method: "QRIS",

                        amount,

                        donor_name,

                        donor_email,

                        donor_phone,

                        is_anonymous

                    })

                }

            );

            const json = await response.json();

            if (!json.success) {

                throw new Error(

                    json.message ||

                    "Gagal membuat donasi."

                );

            }

            const reference =

                json.data.payment.reference;

            location.href =

                "../waiting/waiting.html?reference=" +

                encodeURIComponent(reference);

        }

        catch (err) {

            alert(err.message);

            console.error(err);

            document.getElementById("gpaySubmit").disabled = false;

            document.getElementById("gpaySubmit").textContent =

                "Lanjutkan Pembayaran";

        }

    };

/*==================================
        START
==================================*/

loadCampaign();

updateTotal();