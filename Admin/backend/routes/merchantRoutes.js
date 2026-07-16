const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    createMerchant,
    getMerchants
} = require("../controllers/merchantController");

router.post("/merchant", verifyToken, createMerchant);
router.get("/merchant", verifyToken, getMerchants);

module.exports = router;