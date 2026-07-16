const homeService = require("../services/homeService");

/*==================================
        HOME
==================================*/

exports.getHome = async (req, res) => {

    try {

        const data = await homeService.getHome();

        res.status(200).json({

            success: true,

            data

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