const express = require("express");

const router = express.Router();

const campaignController = require("../controllers/campaignController");

/*==================================
        HOME CAMPAIGNS
==================================*/

router.get(

    "/goces-peduli/home",

    campaignController.getHome

);

/*==================================
        DETAIL CAMPAIGN
==================================*/

router.get(

    "/campaigns/:id",

    campaignController.getCampaignDetail

);

/*==================================
        CREATE CAMPAIGN
==================================*/

router.post(

    "/campaigns",

    campaignController.createCampaign

);

module.exports = router;