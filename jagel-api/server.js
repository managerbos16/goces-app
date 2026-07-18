const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const cartRoutes = require("./routes/cart");
const testRoute = require("./routes/test");
const paymentRoutes = require("./routes/paymentRoutes");
const db = require("./config/db");
const campaignRoutes = require("./routes/campaignRoutes");
const path = require("path");
const donationRoutes = require("./routes/donationRoutes");
const callbackRoutes = require("./routes/callbackRoutes");

const app = express();

app.use(express.json({ limit: "1mb" }));

// Sementara CORS dibuka agar aplikasi Jagel tetap berjalan normal.
app.use(cors());

/*
=================================================
CORS PRODUCTION — AKTIFKAN SETELAH DOMAIN JAGEL
SUDAH DIKETAHUI DARI HEADER "Origin".
=================================================

const allowedOrigins = [
    "https://goces-app.vercel.app",
    "https://goces-api.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    // Contoh: tambahkan domain Jagel yang sebenarnya di sini.
    // "https://app.jagel.id"
];

app.use(cors({
    origin: (origin, callback) => {
        // Mengizinkan callback Tripay dan request server-to-server.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin tidak diizinkan oleh CORS."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
*/

app.use(express.static("public"));
app.use("/", routes);
app.use("/api/cart", cartRoutes);
app.use("/api", testRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/callback", callbackRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server berjalan di port " + PORT);
});

module.exports = app;