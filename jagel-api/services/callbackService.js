const crypto = require("crypto");
const db = require("../config/db");

exports.tripayCallback = async (req) => {
    const callbackSignature = req.headers["x-callback-signature"];
    const callbackEvent = req.headers["x-callback-event"];
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;

    const signature = crypto
        .createHmac("sha256", privateKey)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (!callbackSignature || callbackSignature !== signature) {
        throw new Error("Signature callback tidak valid.");
    }

    if (callbackEvent !== "payment_status") {
        throw new Error("Event callback tidak dikenali.");
    }

    const {
        reference,
        merchant_ref,
        status
    } = req.body;

    const paymentStatus = String(status || "").toUpperCase();

    if (!reference || !merchant_ref) {
        throw new Error("Reference atau merchant reference tidak ditemukan.");
    }

    if (!["PAID", "FAILED", "EXPIRED", "REFUND"].includes(paymentStatus)) {
        throw new Error("Status pembayaran tidak valid.");
    }

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const donationResult = await client.query(
            `
            SELECT *
            FROM campaign_donations
            WHERE reference = $1
            FOR UPDATE
            `,
            [reference]
        );

        if (donationResult.rows.length === 0) {
            throw new Error("Donasi tidak ditemukan.");
        }

        const donation = donationResult.rows[0];

        if (donation.merchant_ref !== merchant_ref) {
            throw new Error("Merchant reference tidak sesuai.");
        }

        // total_amount dapat mencakup biaya yang dibebankan kepada pelanggan.
        const donationAmount =
            Number(req.body.total_amount) -
            Number(req.body.fee_customer || 0);

        if (donationAmount !== Number(donation.amount)) {
            throw new Error("Nominal callback tidak sesuai dengan data donasi.");
        }

        // Mencegah callback PAID yang dikirim ulang menghitung donasi dua kali.
        if (donation.status === "PAID") {
            await client.query("COMMIT");

            return {
                message: "Callback sudah pernah diproses."
            };
        }

        await client.query(
            `
    UPDATE campaign_donations
    SET
        status = $1,
        callback_data = $2,
        paid_at = CASE
            WHEN $3 THEN CURRENT_TIMESTAMP
            ELSE paid_at
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE reference = $4
    `,
            [
                paymentStatus,
                JSON.stringify(req.body),
                paymentStatus === "PAID",
                reference
            ]
        );

        if (paymentStatus === "PAID") {
            const campaignResult = await client.query(
                `
                UPDATE campaigns
                SET
                    collected_amount = collected_amount + $1,
                    donor_count = donor_count + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING id, collected_amount, donor_count
                `,
                [
                    donation.amount,
                    donation.campaign_id
                ]
            );

            if (campaignResult.rows.length === 0) {
                throw new Error("Campaign donasi tidak ditemukan.");
            }
        }

        await client.query("COMMIT");

        return {
            message: "Callback berhasil diproses."
        };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};