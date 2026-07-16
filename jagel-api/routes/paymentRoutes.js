const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");

/*==================================
        PAYMENT CHANNEL
==================================*/

router.get(

    "/channels",

    paymentController.getPaymentChannels

);

/*==================================
        CREATE PAYMENT
==================================*/

router.post(

    "/create",

    paymentController.createPayment

);

/*==================================
        DETAIL PAYMENT
==================================*/

router.get(

    "/detail/:reference",

    paymentController.detailPayment

);

module.exports = router;