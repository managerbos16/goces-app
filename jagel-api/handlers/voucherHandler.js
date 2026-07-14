const renderVoucherPage =
    require("../templates/voucherPage");

const voucherService =
    require("../services/voucherService");

async function voucherHandler(req, res) {

    try {

        const vouchers =
            await voucherService(req);

        res.send(

            renderVoucherPage({

                items: vouchers

            })

        );

    }

    catch (error) {

        console.error(

            "Voucher Error:",

            error

        );

        res.status(500).send(`

<h2>

500 Internal Server Error

</h2>

<p>

Gagal memuat data voucher.

</p>

`);

    }

}

module.exports =
    voucherHandler;