const db = require("../config/db");
const tripayService = require("./tripayService");

/*==================================
        CREATE DONATION
==================================*/

exports.createDonation = async (data) => {

    const amount = Number(data.amount);

    if (!Number.isInteger(amount) || amount < 10000) {
        throw new Error("Nominal donasi minimal Rp10.000.");
    }

    const campaignResult = await db.query(
        `
        SELECT id, title
        FROM campaigns
        WHERE id = $1
        AND status = 'ACTIVE'
        LIMIT 1
        `,
        [data.campaign_id]
    );

    if (campaignResult.rows.length === 0) {
        throw new Error("Campaign tidak ditemukan atau tidak aktif.");
    }

    const campaign = campaignResult.rows[0];

    const paymentMethod = String(data.method || "")
        .trim()
        .toUpperCase();

    const channels = await tripayService.getPaymentChannels();

    const selectedChannel = channels.find(channel =>
        channel.code === paymentMethod &&
        channel.active !== false
    );

    if (!selectedChannel) {
        throw new Error("Metode pembayaran tidak tersedia.");
    }

    const minimumAmount = Number(selectedChannel.minimum_amount || 0);
    const maximumAmount = Number(selectedChannel.maximum_amount || 0);

    if (minimumAmount && amount < minimumAmount) {
        throw new Error(
            "Minimal pembayaran untuk " +
            selectedChannel.name +
            " adalah Rp" +
            minimumAmount.toLocaleString("id-ID") +
            "."
        );
    }

    if (maximumAmount && amount > maximumAmount) {
        throw new Error(
            "Maksimal pembayaran untuk " +
            selectedChannel.name +
            " adalah Rp" +
            maximumAmount.toLocaleString("id-ID") +
            "."
        );
    }

    const tripay = await tripayService.createPayment({

        type: "DON",

        method: paymentMethod,

        amount,

        customer_name: data.donor_name,

        customer_email: data.donor_email,

        customer_phone: data.donor_phone,

        callback_url:
            process.env.APP_URL +
            "/api/callback/tripay",

        return_url:
            process.env.APP_URL +
            "/donation-success",

        order_items: [

            {

                sku: "DONASI",

                name: campaign.title,
                price: amount,

                quantity: 1

            }

        ]

    });

    const result = await db.query(

        `

        INSERT INTO campaign_donations (

            campaign_id,

            merchant_ref,

            reference,

            donor_name,

            donor_email,

            donor_phone,

            amount,

           payment_channel,

           payment_code,

            payment_type,

            payment_name,

            payment_url,

            checkout_url,

            qr_url,

            qr_string,

            fee_customer,

            fee_merchant,

            expired_at,

            status

        )

        VALUES (

            $1,$2,$3,$4,$5,$6,

            $7,$8,$9,$10,$11,

            $12,$13,$14,$15,

            $16,$17,

            to_timestamp($18),

            $19

        )

        RETURNING *

        `,

        [

            campaign.id,

            tripay.merchant_ref,

            tripay.reference,

            data.donor_name,

            data.donor_email,

            data.donor_phone,

            amount,

            tripay.payment_method,

            tripay.pay_code || null,

            tripay.payment_selection_type || tripay.payment_method,

            tripay.payment_name,

            tripay.pay_url || null,

            tripay.checkout_url || null,

            tripay.qr_url || null,

            tripay.qr_string || null,

            Number(tripay.fee_customer || 0),

            Number(tripay.fee_merchant || 0),

            tripay.expired_time,

            tripay.status

        ]

    );

    const donation = result.rows[0];

    return {

        donation: {

            ...donation,

            amount: Number(donation.amount),

            fee_customer: Number(donation.fee_customer),

            fee_merchant: Number(donation.fee_merchant)

        },

        payment: {

            reference: tripay.reference,

            merchant_ref: tripay.merchant_ref,

            payment_method: tripay.payment_method,

            payment_name: tripay.payment_name,

            pay_code: tripay.pay_code || null,

            amount: Number(tripay.amount),

            fee_customer: Number(tripay.fee_customer || 0),

            fee_merchant: Number(tripay.fee_merchant || 0),

            total_fee: Number(tripay.total_fee || 0),

            amount_received: Number(tripay.amount_received || 0),

            qr_url: tripay.qr_url,

            qr_string: tripay.qr_string,

            checkout_url: tripay.checkout_url,

            pay_url: tripay.pay_url,

            expired_time: tripay.expired_time,

            status: tripay.status,

            instructions: tripay.instructions || []

        }

    };

};

/*==================================
        GET DONATION STATUS
==================================*/

exports.getDonationStatus = async (reference) => {

    const result = await db.query(

        `

        SELECT

            id,

            campaign_id,

            merchant_ref,

            reference,

            donor_name,

            donor_email,

            donor_phone,

            amount,

            payment_channel,

            payment_name,

            payment_url,

            checkout_url,

            qr_url,

            qr_string,

            fee_customer,

            fee_merchant,

            expired_at,

            status,

            paid_at,

            created_at,

            updated_at

        FROM campaign_donations

        WHERE reference = $1

        LIMIT 1

        `,

        [reference]

    );

    if (result.rows.length === 0) {

        return null;

    }

    const donation = result.rows[0];

    return {

        ...donation,

        amount: Number(donation.amount),

        fee_customer: Number(donation.fee_customer),

        fee_merchant: Number(donation.fee_merchant)

    };

};