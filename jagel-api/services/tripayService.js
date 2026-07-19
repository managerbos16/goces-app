const axios = require("axios");

const tripay = require("../config/tripay");

const {
    generateMerchantRef,
    generateSignature
} = require("../utils/paymentHelper");

/*==================================
        PAYMENT CHANNEL
==================================*/

exports.getPaymentChannels = async () => {
    const response = await axios.get(
        `${tripay.baseUrl}/merchant/payment-channel`,
        {
            headers: {
                Authorization: `Bearer ${tripay.apiKey}`
            }
        }
    );

    return response.data.data;
};

/*==================================
        CREATE PAYMENT
==================================*/

exports.createPayment = async (data) => {
    const amount = Number(data.amount);

    // TAMBAHKAN: ambil metode pembayaran yang dikirim dari donationService
    const paymentMethod = String(data.method || "")
        .trim()
        .toUpperCase();

    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Nominal pembayaran tidak valid.");
    }

    // TAMBAHKAN: cegah request tanpa metode pembayaran
    if (!paymentMethod) {
        throw new Error("Metode pembayaran tidak valid.");
    }

    const merchantRef =
        data.merchant_ref ||
        generateMerchantRef(data.type || "DON");

    const signature = generateSignature(
        tripay.merchantCode,
        tripay.privateKey,
        merchantRef,
        amount
    );

    const payload = {
        // paymentMethod sekarang sudah tersedia/terdefinisi
        method: paymentMethod,

        merchant_ref: merchantRef,
        amount,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        order_items: data.order_items,
        callback_url: data.callback_url,
        return_url: data.return_url,
        expired_time:
            data.expired_time ||
            Math.floor(Date.now() / 1000) + 86400,
        signature
    };

    const response = await axios.post(
        `${tripay.baseUrl}/transaction/create`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${tripay.apiKey}`
            }
        }
    );

    return response.data.data;
};

/*==================================
        DETAIL PAYMENT
==================================*/

exports.detailPayment = async (reference) => {
    if (!reference) {
        throw new Error("Reference pembayaran tidak valid.");
    }

    const response = await axios.get(
        `${tripay.baseUrl}/transaction/detail`,
        {
            params: {
                reference
            },
            headers: {
                Authorization: `Bearer ${tripay.apiKey}`
            }
        }
    );

    return response.data.data;
};