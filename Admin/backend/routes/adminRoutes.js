const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    getAdmins
} = require("../controllers/adminController");

router.get("/admins", verifyToken, getAdmins);

module.exports = router;