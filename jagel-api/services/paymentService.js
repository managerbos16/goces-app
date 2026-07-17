const db = require("../config/db");
const tripayService = require("./tripayService");

/*==================================
        DETAIL PAYMENT
==================================*/

exports.getPaymentDetail = async (reference) => {

    const payment = await tripayService.detailPayment(reference);

    if (!payment) {

        return null;

    }

    await db.query(

        `
    UPDATE campaign_donations
    SET
        status = $1::varchar,

        paid_at = CASE
            WHEN $1::varchar = 'PAID'
            AND paid_at IS NULL
            THEN CURRENT_TIMESTAMP
            ELSE paid_at
        END,

        updated_at = CURRENT_TIMESTAMP

    WHERE reference = $2
    `,

        [

            payment.status,

            reference

        ]

    );

    return payment;

};