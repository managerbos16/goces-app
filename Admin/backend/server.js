const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const merchantRoutes = require("./routes/merchantRoutes");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

// Test koneksi database
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "GOCES Backend Running 🚀",
            database_time: result.rows[0].now
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// Route Authentication
app.use("/api", authRoutes);
app.use("/api", permissionRoutes);
app.use("/api", adminRoutes);
app.use("/api", merchantRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
});
