(() => {
    const API_BASE = "https://goces-api.vercel.app/api";

    let campaign = null;
    let paymentChannels = [];
    let selectedMethod = null;

    function formatRupiah(number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(Number(number) || 0);
    }

    function updateTotal() {
        const amount = Number(
            document.getElementById("donationAmount").value || 0
        );

        document.getElementById("gpayTotal").textContent =
            formatRupiah(amount);
    }

    function renderPaymentChannels(channels) {
        const container = document.getElementById("gpayMethods");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (channels.length === 0) {
            container.textContent =
                "Belum ada metode pembayaran yang aktif.";
            container.className = "gpay-method-message";
            return;
        }

        const groupedChannels = channels.reduce((groups, channel) => {
            const groupName = channel.group || "Metode Pembayaran";

            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push(channel);

            return groups;
        }, {});

        Object.entries(groupedChannels).forEach(([groupName, items]) => {
            const heading = document.createElement("p");

            heading.className = "gpay-method-group";
            heading.textContent = groupName;

            container.appendChild(heading);

            items.forEach(channel => {
                const label = document.createElement("label");
                const radio = document.createElement("input");
                const info = document.createElement("span");
                const name = document.createElement("strong");
                const note = document.createElement("small");

                label.className = "gpay-method";

                radio.type = "radio";
                radio.name = "paymentMethod";
                radio.value = channel.code;

                const shouldSelect =
                    selectedMethod === channel.code ||
                    (!selectedMethod && channel.code === "QRIS") ||
                    (!selectedMethod &&
                        channel === paymentChannels[0]);

                radio.checked = shouldSelect;

                if (radio.checked) {
                    selectedMethod = channel.code;
                }

                radio.addEventListener("change", function () {
                    selectedMethod = channel.code;
                });

                name.textContent = channel.name || channel.code;

                const min = Number(channel.minimum_amount || 0);
                const max = Number(channel.maximum_amount || 0);

                if (min && max) {
                    note.textContent =
                        "Min. " +
                        formatRupiah(min) +
                        " • Maks. " +
                        formatRupiah(max);
                } else if (min) {
                    note.textContent =
                        "Minimal " + formatRupiah(min);
                } else {
                    note.textContent =
                        "Pembayaran aman melalui Tripay";
                }

                info.className = "gpay-method-info";
                info.appendChild(name);
                info.appendChild(note);

                label.appendChild(radio);
                label.appendChild(info);

                if (channel.icon_url) {
                    const icon = document.createElement("img");

                    icon.className = "gpay-method-icon";
                    icon.src = channel.icon_url;
                    icon.alt = channel.name || channel.code;

                    icon.onerror = function () {
                        this.remove();
                    };

                    label.appendChild(icon);
                }

                container.appendChild(label);
            });
        });
    }

    async function loadPaymentChannels() {
        const container = document.getElementById("gpayMethods");

        if (!container) {
            return;
        }

        container.className = "gpay-methods";
        container.textContent = "Memuat metode pembayaran...";

        try {
            const response = await fetch(
                API_BASE + "/payment/channels"
            );

            if (!response.ok) {
                throw new Error("Gagal memuat metode pembayaran.");
            }

            const json = await response.json();

            // Endpoint lama mengembalikan array langsung.
            // Ini juga tetap kompatibel jika nantinya API memakai { data: [] }.
            const channels = Array.isArray(json)
                ? json
                : json.data || [];

            paymentChannels = channels.filter(channel =>
                channel &&
                channel.code &&
                channel.active !== false
            );

            renderPaymentChannels(paymentChannels);

        } catch (err) {
            console.error(err);

            container.className = "gpay-method-message";
            container.textContent =
                "Metode pembayaran tidak dapat dimuat. Silakan coba lagi.";
        }
    }

    function loadCampaign() {
        document.getElementById("gpayLoading").style.display = "block";
        document.getElementById("gpayContent").style.display = "none";

        campaign = window.selectedCampaign;

        if (!campaign) {
            alert("Campaign tidak ditemukan.");
            showPage("home");
            return;
        }

        document.getElementById("gpayLoading").style.display = "none";
        document.getElementById("gpayContent").style.display = "block";

        const image = document.getElementById("gpayImage");

        if (image) {
            image.src = campaign.cover_image || "";
        }

        document.getElementById("gpayTitle").textContent =
            campaign.title;

        document.getElementById("gpayTarget").textContent =
            "Target " + formatRupiah(campaign.target_amount);

        document.getElementById("donationAmount").value = 10000;

        updateTotal();
        loadPaymentChannels();
    }

    document.querySelectorAll(".gpay-quick button").forEach(button => {
        button.onclick = function () {
            document.getElementById("donationAmount").value =
                button.dataset.value;

            updateTotal();
        };
    });

    document
        .getElementById("donationAmount")
        .addEventListener("input", updateTotal);

    document.getElementById("gpaySubmit").onclick = async function () {
        const donor_name =
            document.getElementById("donorName").value.trim();

        const donor_email =
            document.getElementById("donorEmail").value.trim();

        const donor_phone =
            document.getElementById("donorPhone").value.trim();

        const amount =
            Number(document.getElementById("donationAmount").value);

        const is_anonymous =
            document.getElementById("isAnonymous").checked;

        const selectedRadio = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        const method =
            selectedRadio?.value || selectedMethod;

        if (!donor_name) {
            showToast("Nama wajib diisi.");

            return;
        }

        if (!donor_email) {
            showToast("Email wajib diisi.");

            return;
        }

        if (!donor_phone) {
            showToast("Nomor WhatsApp wajib diisi.");

            return;
        }

        if (amount < 10000) {
            showToast("Minimal donasi Rp10.000");

            return;
        }

        if (!method) {
            showToast("Silakan pilih metode pembayaran.");

            return;
        }

        try {
            const submit =
                document.getElementById("gpaySubmit");

            submit.disabled = true;
            submit.textContent = "Memproses...";

            const response = await fetch(
                API_BASE + "/donations/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        campaign_id: campaign.id,
                        method,
                        amount,
                        donor_name,
                        donor_email,
                        donor_phone,
                        is_anonymous
                    })
                }
            );

            const json = await response.json();

            if (!response.ok || !json.success) {
                throw new Error(
                    json.message ||
                    "Gagal membuat transaksi."
                );
            }

            window.currentPayment = json.data.payment;
            window.currentReference =
                json.data.payment.reference;

            submit.disabled = false;
            submit.textContent = "Lanjutkan Pembayaran";

            showPage("goces-waiting");

            if (typeof loadPayment === "function") {
                loadPayment();
            }

        } catch (err) {
            showToast(err.message);
            console.error(err);

            const submit =
                document.getElementById("gpaySubmit");

            submit.disabled = false;
            submit.textContent =
                "Lanjutkan Pembayaran";
        }
    };

    window.loadCampaign = loadCampaign;
})();