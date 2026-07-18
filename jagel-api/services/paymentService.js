const tripayService = require("./tripayService");

/*==================================
        DETAIL PAYMENT
==================================*/

exports.getPaymentDetail = async (reference) => {
    const payment = await tripayService.detailPayment(reference);

    if (!payment) {
        return null;
    }

    /*
        Endpoint ini hanya mengambil status terbaru dari Tripay
        untuk ditampilkan di halaman QRIS.

        Jangan update tabel campaign_donations di sini.
        Update status donasi, total terkumpul, dan jumlah donatur
        hanya dilakukan oleh callback Tripay agar datanya tidak
        terlambat, dobel, atau tidak sinkron.
    */
    return payment;
};