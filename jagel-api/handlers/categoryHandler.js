const jagelService =
    require("../services/jagelService");

const renderProductGrid =
    require("../templates/productGrid");

const renderProductHorizontal =
    require("../templates/productHorizontal");

async function categoryHandler(req, res) {

    try {

        const response =
            await jagelService.getComponent(
                req.category.componentId
            );

        response.data.lists.data.forEach((item, index) => {

            console.log(
                index + 1,
                item.title,
                item.content
            );

        });

        const data = {

            page: req.category.page,

            title: req.category.title,

            items: response.data.lists.data || []

        };

        if (req.layout === "horizontal") {

            res.send(

                renderProductHorizontal(data)

            );

        }

        else {

            res.send(

                renderProductGrid(data)

            );

        }

    }

    catch (err) {

        res.status(500).send(err.message);

    }

}

module.exports = categoryHandler;