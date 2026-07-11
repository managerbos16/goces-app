const renderProductCardHorizontal =
    require("./components/renderProductCardHorizontal");

function renderProductHorizontal(data) {

    let cards = "";

    data.items.forEach(product => {

        cards += renderProductCardHorizontal(product);

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

<link rel="stylesheet" href="/css/app.css">

<link rel="stylesheet" href="/css/horizontal.css">

<script
src="/js/cart.js"></script>

</head>

<body>

<div class="gch-container">

    ${data.title ? `

        <h2 class="gc-section-title">

            ${data.title}

        </h2>

    ` : ""}

    <div class="gch-list">

        ${cards}

    </div>

</div>

<script>

function sendHeight() {

    window.parent.postMessage({

        type: "goces-frame",

        page: "${data.page}",

        height: document.documentElement.scrollHeight,

        totalItems: ${data.items.length},

        empty: ${data.items.length} === 0

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

module.exports = renderProductHorizontal;