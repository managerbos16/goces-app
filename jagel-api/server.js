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

app.use(express.json());
app.use(cors());
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