const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const {
    getPermissions
} = require("../controllers/permissionController");

// Ambil permission berdasarkan role admin yang login
router.get("/permissions", verifyToken, getPermissions);

module.exports = router;