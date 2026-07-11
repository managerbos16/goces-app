function renderProductPromo(product) {

    if (product.type === 4) {

        return "";

    }

    const oldPrice = Number(product.price_before_discount || 0);
    const newPrice = Number(product.price || 0);

    if (
        oldPrice <= 0 ||
        oldPrice <= newPrice
    ) {
        return "";
    }

    const discount = Math.round(
        ((oldPrice - newPrice) / oldPrice) * 100
    );

    return `

<div class="gc-card__promo">

    DISKON ${discount}%

</div>

`;

}

module.exports = renderProductPromo;