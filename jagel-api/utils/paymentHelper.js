const crypto = require("crypto");

/*==================================
        MERCHANT REF
==================================*/

exports.generateMerchantRef = function (
    prefix = "PAY"
) {

    const random = Math.random()

        .toString(36)

        .substring(2, 8)

        .toUpperCase();

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        random
    );

};

/*==================================
        SIGNATURE
==================================*/

exports.generateSignature = function (

    merchantCode,

    privateKey,

    merchantRef,

    amount

) {

    return crypto

        .createHmac(

            "sha256",

            privateKey

        )

        .update(

            merchantCode +

            merchantRef +

            amount

        )

        .digest("hex");

};