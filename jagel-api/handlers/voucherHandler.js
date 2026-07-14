const voucherService =
    require("../services/voucherService");

async function voucherHandler(req, res) {

    try {

        const vouchers =
            await voucherService(req);

        res.json({

            success: true,

            data: vouchers

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Gagal mengambil voucher."

        });

    }

}

module.exports =
    voucherHandler;