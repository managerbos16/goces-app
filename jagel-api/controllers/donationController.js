const donationService = require("../services/donationService");

/*==================================
        CREATE DONATION
==================================*/

exports.createDonation = async (req, res) => {

    try {

        const result =
            await donationService.createDonation(req.body);

        return res.status(201).json({

            success: true,

            message: "Donasi berhasil dibuat.",

            data: result

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.response?.data?.message || err.message

        });

    }

};

/*==================================
        DONATION STATUS
==================================*/

exports.getDonationStatus = async (req, res) => {

    try {

        const donation =
            await donationService.getDonationStatus(

                req.params.reference

            );

        if (!donation) {

            return res.status(404).json({

                success: false,

                message: "Donasi tidak ditemukan."

            });

        }

        return res.status(200).json({

            success: true,

            data: donation

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};