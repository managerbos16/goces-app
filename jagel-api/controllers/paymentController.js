const tripayService = require("../services/tripayService");
const paymentService = require("../services/paymentService");

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

exports.getPaymentDetail = async (req, res) => {

    try {

        const payment = await paymentService.getPaymentDetail(

            req.params.reference

        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Pembayaran tidak ditemukan."

            });

        }

        return res.json({

            success: true,

            data: payment

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};