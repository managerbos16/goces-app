function format(number) {

    return Number(number)
        .toLocaleString("id-ID");

}

function renderProductPrice(product) {

    if (product.type === 4) {

        return "";

    }

    const oldPrice = Number(product.price_before_discount || 0);

    const newPrice = Number(product.price || 0);

    if (newPrice <= 0) {

        return "";

    }

    if (
        oldPrice > 0 &&
        oldPrice > newPrice
    ) {

        return `

<div class="gc-card__price-wrap">

    <div class="gc-card__old-price">

        ${product.currency} ${format(oldPrice)}

    </div>

    <div class="gc-card__price">

        ${product.currency} ${format(newPrice)}

    </div>

</div>

`;

    }

    return `

<div class="gc-card__price">

    ${product.currency} ${format(newPrice)}

</div>

`;

}

module.exports = renderProductPrice;