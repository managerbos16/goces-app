const tripayService = require("../services/tripayService");

/*==================================
        PAYMENT CHANNEL
==================================*/

exports.getPaymentChannels = async (req, res) => {

    try {

        const result = await tripayService.getPaymentChannels();

        res.status(200).json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Gagal mengambil payment channel",

            error: err.message || err

        });

    }

};

/*==================================
        CREATE PAYMENT
==================================*/

exports.createPayment = async (req, res) => {

    try {

        const result = await tripayService.createPayment(

            req.body

        );

        res.status(200).json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Gagal membuat pembayaran",

            error: err.response?.data || err.message

        });

    }

};

/*==================================
        DETAIL PAYMENT
==================================*/

exports.detailPayment = async (req, res) => {

    try {

        const result = await tripayService.detailPayment(

            req.params.reference

        );

        res.status(200).json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Gagal mengambil detail pembayaran",

            error: err.response?.data || err.message

        });

    }

};