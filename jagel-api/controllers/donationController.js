const donationService = require("../services/donationService");

/*==================================
        CREATE DONATION
==================================*/

exports.createDonation = async (req, res) => {

    try {

        const result =
            await donationService.createDonation(req.body);

        res.status(201).json({

            success: true,

            message: "Donasi berhasil dibuat.",

            data: result

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.response?.data?.message || err.message

        });

    }

};