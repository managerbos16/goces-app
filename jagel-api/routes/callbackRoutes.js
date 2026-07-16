const express = require("express");

const router = express.Router();

const callbackController =
    require("../controllers/callbackController");

router.post(

    "/tripay",

    callbackController.tripayCallback

);

module.exports = router;