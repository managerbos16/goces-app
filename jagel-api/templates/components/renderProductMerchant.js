function renderProductMerchant(product) {

    return `
<div class="gc-card__merchant">

    ${product.partner_name || "Official Store"}

</div>
`;

}

module.exports = renderProductMerchant;