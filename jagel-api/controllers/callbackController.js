const callbackService = require("../services/callbackService");

/*==================================
        TRIPAY CALLBACK
==================================*/

exports.tripayCallback = async (req, res) => {

    try {

        const result = await callbackService.tripayCallback(req);

        return res.status(200).json({

            success: true,

            message: "Callback berhasil diproses.",

            data: result

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};