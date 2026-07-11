function renderProductDescription(product) {

    if (product.type === 4) {

        return "";

    }

    if (!product.content) {

        return "";

    }

    return `

<div class="gc-card__description">

    ${product.content}

</div>

`;

}

module.exports = renderProductDescription;