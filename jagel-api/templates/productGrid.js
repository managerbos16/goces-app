const renderProductCard =
    require("./components/renderProductCard");

function renderProductGrid(data) {

    let cards = "";

    data.items.forEach(product => {

        cards += renderProductCard(product);

    });

    return `

<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1">

<title>${data.title}</title>

<link
rel="stylesheet"
href="/css/app.css">

<script src="/js/cart.js"></script>

</head>

<body>

<div class="gc-container">

    <h2 class="gc-title">

        ${data.title}

    </h2>

    <div class="gc-grid">

        ${cards}

    </div>

</div>

<script>

function sendHeight() {

    const totalItems = ${data.items.length};

    window.parent.postMessage({

        type: "goces-frame",

        page: "${data.page}",

        height: document.documentElement.scrollHeight,

        totalItems: totalItems,

        empty: totalItems === 0

    }, "*");

}

window.addEventListener("load", sendHeight);

if (window.ResizeObserver) {

    new ResizeObserver(sendHeight).observe(document.body);

}

</script>

</body>

</html>

`;

}

module.exports = renderProductGrid;