const voucher = require("./voucher");

async function voucherService(req) {

    const page = (req.query.category || "semua").toLowerCase();

    switch (page) {

        case "populer":

            return voucher.populer;

        case "terbaru":

            return voucher.terbaru;

        case "eksklusif":

            return voucher.eksklusif;

        case "cashback":

            return voucher.cashback;

        case "terbatas":

            return voucher.terbatas;

        case "semua":

        default:

            return [

                ...voucher.populer,

                ...voucher.terbaru,

                ...voucher.eksklusif,

                ...voucher.cashback,

                ...voucher.terbatas

            ];

    }

}

module.exports = voucherService;