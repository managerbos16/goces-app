const express = require("express");

const router = express.Router();

const donationController = require("../controllers/donationController");

/*==================================
        CREATE DONATION
==================================*/

router.post(

    "/create",

    donationController.createDonation

);

/*==================================
        DONATION STATUS
==================================*/

router.get(

    "/status/:reference",

    donationController.getDonationStatus

);

module.exports = router;