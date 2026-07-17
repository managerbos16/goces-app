const campaignModel = require("../models/campaignModel");

/*==================================
        HOME CAMPAIGNS
==================================*/

exports.getHome = async (req, res) => {

    try {

        const campaigns =
            await campaignModel.getAllCampaigns();

        const statistics = {

            campaigns: campaigns.length,

            total_collected: campaigns.reduce(

                (total, item) =>

                    total + item.collected_amount,

                0

            ),

            donors: campaigns.reduce(

                (total, item) =>

                    total + item.donor_count,

                0

            ),

            donations: campaigns.reduce(

                (total, item) =>

                    total + item.donor_count,

                0

            )

        };

        res.json({

            success: true,

            data: {

                campaigns,

                statistics

            }

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*==================================
        DETAIL CAMPAIGN
==================================*/

exports.getCampaignDetail = async (req, res) => {

    try {

        const campaign =
            await campaignModel.getCampaignDetail(

                req.params.id

            );

        if (!campaign) {

            return res.status(404).json({

                success: false,

                message: "Campaign tidak ditemukan."

            });

        }

        res.json({

            success: true,

            data: campaign

        });

    }

    catch (err) {

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

        const campaign =
            await campaignModel.createCampaign(

                req.body

            );

        res.status(201).json({

            success: true,

            message: "Campaign berhasil dibuat.",

            data: campaign

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};