const cartService =
    require("../services/cartService");

async function add(req, res) {

    try {

        const {

            session,

            list_vuid,

            quantity

        } = req.body;

        const result =
            await cartService.addToCart(

                session,

                list_vuid,

                quantity

            );

        res.json(result);

    }

    catch (err) {

        console.error(err.response?.data || err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {

    add

};