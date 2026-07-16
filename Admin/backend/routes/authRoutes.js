const express = require("express");
const router = express.Router();

const {
    setupAdmin,
    loginAdmin,
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
    getAdminById,
    updateAdmin,
    getRoles,
    getPermissionsByRole,
    updatePermissions,
    resetAdminPassword
} = require("../controllers/authController");

// Setup Super Admin (dipakai sekali)
router.post("/setup", setupAdmin);
router.post("/login", loginAdmin);
router.post("/register-admin", registerAdmin);
router.get("/pending-admins", getPendingAdmins);
router.get("/roles", getRoles);
router.patch("/admins/approve/:id", approveAdmin);
router.patch("/admins/reject/:id", rejectAdmin);
router.get("/admins/:id", getAdminById);
router.put("/admins/:id", updateAdmin);
router.get("/permissions/:role_id", getPermissionsByRole);
router.put("/permissions/:role_id", updatePermissions);
router.put("/admins/reset-password/:id", resetAdminPassword);

module.exports = router;