const express = require("express");

const router = express.Router();

const voucherHandler = require("../handlers/voucherHandler");

router.get(

    "/voucher",

    voucherHandler

);

module.exports = router;