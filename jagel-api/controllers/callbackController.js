const crypto = require("crypto");
const db = require("../config/db");

/*==================================
        TRIPAY CALLBACK
==================================*/

exports.tripayCallback = async (req, res) => {

    try {

        /*==================================
                VERIFY SIGNATURE
        ==================================*/

        const callbackSignature =
            req.headers["x-callback-signature"];

        const privateKey =
            process.env.TRIPAY_PRIVATE_KEY;

        const rawBody =
            JSON.stringify(req.body);

        const signature = crypto
            .createHmac("sha256", privateKey)
            .update(rawBody)
            .digest("hex");

        if (callbackSignature !== signature) {

            return res.status(401).json({

                success: false,

                message: "Signature tidak valid"

            });

        }

        const {

            reference,

            status

        } = req.body;

        if (!reference) {

            return res.status(400).json({

                success: false,

                message: "Reference tidak ditemukan"

            });

        }

        /*==================================
                AMBIL DATA DONASI
        ==================================*/

        const donationResult = await db.query(

            `

            SELECT *

            FROM campaign_donations

            WHERE reference = $1

            `,

            [reference]

        );

        if (donationResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Donasi tidak ditemukan"

            });

        }

        const donation = donationResult.rows[0];

        /*==================================
                CEGAH DOUBLE CALLBACK
        ==================================*/

        if (

            donation.status === "PAID" &&

            status === "PAID"

        ) {

            return res.json({

                success: true,

                message: "Callback sudah pernah diproses"

            });

        }

        /*==================================
                UPDATE DONATION
        ==================================*/

        await db.query(

            `

            UPDATE campaign_donations

            SET

                status = $1,

                callback_data = $2,

                paid_at = CASE

                    WHEN $1 = 'PAID'

                    THEN CURRENT_TIMESTAMP

                    ELSE paid_at

                END,

                updated_at = CURRENT_TIMESTAMP

            WHERE reference = $3

            `,

            [

                status,

                JSON.stringify(req.body),

                reference

            ]

        );

        /*==================================
                UPDATE CAMPAIGN
        ==================================*/

        if (status === "PAID") {

            await db.query(

                `

                UPDATE campaigns

                SET

                    collected_amount = collected_amount + $1,

                    donor_count = donor_count + 1,

                    updated_at = CURRENT_TIMESTAMP

                WHERE id = $2

                `,

                [

                    donation.amount,

                    donation.campaign_id

                ]

            );

        }

        res.json({

            success: true,

            message: "Callback berhasil diproses"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};