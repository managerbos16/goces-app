const jagelService =
    require("../services/jagelService");

const renderProductHorizontal =
    require("../templates/productHorizontal");

async function horizontalHandler(req, res) {

    try {

        const response =
            await jagelService.getComponent(
                req.params.componentId
            );

        const data = {

            page: req.params.componentId,

            title: response.data.component.title,

            items: response.data.lists.data || []

        };

        res.send(

            renderProductHorizontal(data)

        );

    }

    catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

}

module.exports = horizontalHandler;