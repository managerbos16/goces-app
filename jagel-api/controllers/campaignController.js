const Campaign = require("../models/campaignModel");

/*==================================
        GET ALL CAMPAIGNS
==================================*/

exports.getAllCampaigns = async (req, res) => {

    try {

        const campaigns =
            await Campaign.getAllCampaigns();

        res.status(200).json({

            success: true,

            data: campaigns

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*==================================
        GET CAMPAIGN BY ID
==================================*/

exports.getCampaignById = async (req, res) => {

    try {

        const campaign =
            await Campaign.getCampaignById(

                req.params.id

            );

        if (!campaign) {

            return res.status(404).json({

                success: false,

                message: "Campaign tidak ditemukan"

            });

        }

        res.status(200).json({

            success: true,

            data: campaign

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*==================================
        CREATE CAMPAIGN
==================================*/

exports.createCampaign = async (req, res) => {

    try {

        const data = req.body;

        /*==============================
            AUTO GENERATE SLUG
        ==============================*/

        data.slug = data.title

            .toLowerCase()

            .trim()

            .replace(/[^\w\s-]/g, "")

            .replace(/\s+/g, "-");

        const campaign =
            await Campaign.createCampaign(

                data

            );

        res.status(201).json({

            success: true,

            message: "Campaign berhasil dibuat",

            data: campaign

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*==================================
        UPLOAD CAMPAIGN IMAGE
==================================*/

exports.uploadImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Gambar belum dipilih."

            });

        }

        const imageUrl =

            req.protocol +

            "://" +

            req.get("host") +

            "/uploads/campaigns/" +

            req.file.filename;

        res.status(200).json({

            success: true,

            message: "Upload berhasil",

            url: imageUrl

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};