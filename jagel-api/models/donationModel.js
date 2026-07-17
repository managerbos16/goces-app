const db = require("../config/db");

/*==================================
        CREATE DONATION
==================================*/

async function createDonation(data) {

    const result = await db.query(

        `

        INSERT INTO campaign_donations(

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

            status

        )

        VALUES(

            $1,$2,$3,$4,$5,$6,

            $7,$8,$9,$10,$11,

            $12,$13,$14,$15,

            $16,$17,$18

        )

        RETURNING *

        `,

        [

            data.campaign_id,

            data.merchant_ref,

            data.reference,

            data.donor_name,

            data.donor_email,

            data.donor_phone,

            data.amount,

            data.payment_channel,

            data.payment_code,

            data.payment_type,

            data.payment_name,

            data.payment_url,

            data.checkout_url,

            data.qr_url,

            data.qr_string,

            data.fee_customer,

            data.fee_merchant,

            data.status

        ]

    );

    return result.rows[0];

}

/*==================================
        GET STATUS DONATION
==================================*/

async function getDonationStatus(reference) {

    const result = await db.query(

        `

        SELECT

            *

        FROM campaign_donations

        WHERE reference=$1

        LIMIT 1

        `,

        [reference]

    );

    if (result.rows.length === 0) {

        return null;

    }

    return result.rows[0];

}

/*==================================
        EXPORT
==================================*/

module.exports = {

    createDonation,

    getDonationStatus

};