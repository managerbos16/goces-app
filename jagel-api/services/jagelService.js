const axios = require("axios");

async function getComponent(componentId) {

    const response = await axios.get(
        `https://app.jagel.id/api/v2/customer/component/${componentId}`,
        {
            params: {
                codename: "gocesapp",
                page: 1,
                app_mode: 1,
                per_page: 8
            }
        }
    );

    return response.data;

}

module.exports = {
    getComponent
};