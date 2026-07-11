const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const cartRoutes = require("./routes/cart");
const testRoute = require("./routes/test");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use("/", routes);
app.use("/api/cart", cartRoutes);
app.use("/api", testRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server berjalan di port " + PORT);
});

module.exports = app;