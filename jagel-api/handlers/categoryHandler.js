const jagelService =
    require("../services/jagelService");

const renderProductGrid =
    require("../templates/productGrid");

async function categoryHandler(req, res) {

    try {

        const response =
            await jagelService.getComponent(
                req.category.componentId
            );

        const data = {

            title: req.category.title,

            items: response.data.lists.data || []

        };

        res.send(

            renderProductGrid(data)

        );

    }

    catch (err) {

        res.status(500).send(err.message);

    }

}

module.exports = categoryHandler;