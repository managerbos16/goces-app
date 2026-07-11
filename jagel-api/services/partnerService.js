const axios = require("axios");

async function getPartner(viewUid) {

    const response = await axios.post(

        "https://app.jagel.id/api/partner/detail-mitra",

        new URLSearchParams({

            page: 1,

            view_uid: viewUid

        }),

        {

            headers: {

                "Accept": "application/json",

                "Content-Type": "application/x-www-form-urlencoded"

            }

        }

    );

    return response.data;

}

module.exports = {

    getPartner

};