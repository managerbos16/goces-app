// =====================================
// LOAD MERCHANT
// =====================================

async function loadMerchants() {

    const token = localStorage.getItem("token");

    const tbody =
        document.getElementById("merchant-table-body");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;padding:25px;">
                Memuat data merchant...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(

            "http://localhost:3000/api/merchant",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if (!result.success) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;color:red;">
                        ${result.message}
                    </td>
                </tr>
            `;

            return;

        }

        if (result.data.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Belum ada merchant.
                    </td>
                </tr>
            `;

            return;

        }

        let html = "";

        result.data.forEach(item => {

            html += `

            <tr>

                <td>${item.merchant_code}</td>

                <td>${item.merchant_name}</td>

                <td>${item.owner_name}</td>

                <td>${item.phone}</td>

                <td>

                    <span class="badge pending">

                        ${item.status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn-action"
                        onclick="openMerchant('${item.id}')">

                        Kelola

                    </button>

                </td>

            </tr>

            `;

        });

        tbody.innerHTML = html;

    } catch (err) {

        console.error(err);

        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Gagal terhubung ke server.
                </td>
            </tr>
        `;

    }

}

// =====================================
// OPEN MERCHANT
// =====================================

function openMerchant(id) {

    console.log("Merchant diklik :", id);

    const modal =
        document.getElementById("merchant-modal");

    console.log(modal);

    if (!modal) {

        alert("merchant-modal tidak ditemukan");

        return;

    }

    modal.classList.add("show");

}

// =====================================
// CLOSE MERCHANT
// =====================================

function closeMerchantModal() {

    document
        .getElementById("merchant-modal")
        .classList.remove("show");

}

// =====================================
// SAVE MERCHANT
// =====================================

function saveMerchant() {

    alert("Save Merchant");

}