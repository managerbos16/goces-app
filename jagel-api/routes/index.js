const express = require("express");

const router = express.Router();

const categoryRoutes = require("./categoryRoutes");

router.get("/", (req, res) => {

    res.send(`
        <h2>🚀 GOCES API</h2>
        <p>Server berjalan dengan baik.</p>
    `);

});

router.use("/", categoryRoutes);

module.exports = router;