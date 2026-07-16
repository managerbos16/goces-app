require("dotenv").config();

module.exports = {
    merchantCode: process.env.TRIPAY_MERCHANT_CODE,
    apiKey: process.env.TRIPAY_API_KEY,
    privateKey: process.env.TRIPAY_PRIVATE_KEY,
    baseUrl:
        process.env.TRIPAY_ENV === "production"
            ? "https://tripay.co.id/api"
            : "https://tripay.co.id/api-sandbox"
};