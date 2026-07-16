const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");
const upload = require("../middlewares/uploadCampaign");

/*==================================
        GET ALL CAMPAIGNS
==================================*/

router.get(

    "/",

    campaignController.getAllCampaigns

);
/*==================================
        UPLOAD IMAGE
==================================*/

router.post(

    "/upload",

    upload.single("image"),

    campaignController.uploadImage

);

/*==================================
        GET CAMPAIGN BY ID
==================================*/

router.get(

    "/:id",

    campaignController.getCampaignById

);

/*==================================
        CREATE CAMPAIGN
==================================*/

router.post(

    "/",

    campaignController.createCampaign

);

module.exports = router;