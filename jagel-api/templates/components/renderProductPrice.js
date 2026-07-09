function renderProductPrice(product) {

    return `

<div class="gc-card__price">

Rp ${Number(product.price).toLocaleString("id-ID")}

</div>

`;

}

module.exports = renderProductPrice;