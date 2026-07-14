const renderVoucherCard =
    require("./voucherCard");

function renderVoucherPage(data) {

    const cards =
        (data.items || [])
            .map(renderVoucherCard)
            .join("");

    return `

<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1.0,viewport-fit=cover">

<title>Voucher</title>

<link
rel="stylesheet"
href="/css/voucher.css">

</head>

<body>

<div class="gcv-wrapper">

${cards}

</div>

<div class="gcv-toast"></div>

<div class="gcv-modal">

    <div class="gcv-modal-content">

        <button class="gcv-modal-close">

            ✕

        </button>

        <div class="gcv-modal-header">

            <img
                class="gcv-modal-image"
                src=""
                alt="Voucher">

        </div>

        <h2 class="gcv-modal-title"></h2>

        <p class="gcv-modal-description"></p>

        <div class="gcv-modal-code"></div>

        <div class="gcv-modal-period"></div>

        <div class="gcv-modal-min-order"></div>

        <div class="gcv-modal-max-discount"></div>

        <div class="gcv-terms">

            <div class="gcv-terms-title">

                Syarat & Ketentuan

            </div>

            <ul class="gcv-terms-list"></ul>

        </div>

        <button class="gcv-modal-copy">

            Salin Voucher

        </button>

    </div>

</div>

<script src="/js/voucher.js"></script>

<script>

function sendHeight() {

    window.parent.postMessage({

        type: "goces-frame",

        page: "voucher",

        height: document.documentElement.scrollHeight,

        totalItems: ${data.items.length},

        empty: ${data.items.length} === 0

    }, "*");

}

window.addEventListener("load", () => {

    sendHeight();

    setTimeout(sendHeight, 300);

    setTimeout(sendHeight, 800);

});

if (window.ResizeObserver) {

    new ResizeObserver(sendHeight).observe(document.body);

}

</script>

</body>

</html>

`;

}

module.exports = renderVoucherPage;