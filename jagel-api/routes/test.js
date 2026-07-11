const express = require("express");

const router = express.Router();

const partnerService = require("../services/partnerService");

router.get("/partner-test", async (req, res) => {

    try {

        const result = await partnerService.getPartner("6a3a13ce92118");

        res.json(result);

    }

    catch (err) {

        console.error(err.response?.data || err.message);

        res.status(500).json({

            error: err.response?.data || err.message

        });

    }

});

module.exports = router;