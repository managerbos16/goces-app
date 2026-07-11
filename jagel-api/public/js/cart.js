/*==================================================
                GOCES CART
==================================================*/

window.GocesCart = {

    async add(button) {
        alert("Tombol + berhasil diklik");

        const viewUid = button.dataset.viewUid;

        const form = new FormData();

        form.append("list_vuid", viewUid);
        form.append("quantity", 1);

        try {

            const response = await fetch(

                "https://app.jagel.id/api/v2/customer/cart/add",

                {

                    method: "POST",

                    body: form,

                    credentials: "include",

                    headers: {

                        Accept: "application/json"

                    }

                }

            );

            const result = await response.json();

            console.log(result);

            if (result.success) {

                alert("Produk berhasil ditambahkan.");

            } else {

                alert(result.message || "Gagal menambahkan produk.");

            }

        }

        catch (err) {

            console.error(err);

            alert("Terjadi kesalahan.");

        }

    }

};

document.addEventListener("click", function (e) {

    const button = e.target.closest(".gc-card__add");

    if (!button) return;

    e.preventDefault();

    e.stopPropagation();

    e.stopImmediatePropagation();

    GocesCart.add(button);

}, true);