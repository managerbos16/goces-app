const axios = require("axios");
const FormData = require("form-data");

async function addToCart(session, listVuid, quantity = 1) {

    const form = new FormData();

    form.append("list_vuid", listVuid);
    form.append("quantity", quantity);

    const response = await axios.post(

        "https://app.jagel.id/api/v2/customer/cart/add",

        form,

        {

            headers: {

                ...form.getHeaders(),

                Accept: "application/json",

                Authorization: `Bearer ${session}`

            }

        }

    );

    return response.data;

}

module.exports = {

    addToCart

};