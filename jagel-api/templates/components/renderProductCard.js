const renderProductImage = require("./renderProductImage");
const renderProductTitle = require("./renderProductTitle");
const renderProductMerchant = require("./renderProductMerchant");
const renderProductPrice = require("./renderProductPrice");

function renderProductCard(product) {

    return `

<a
class="gc-card"
href="action://p/${product.view_uid}">

<div class="gc-card__image">

    ${renderProductImage(product)}

    <button class="gc-card__favorite">

        ♡

    </button>

    <span class="gc-card__badge">

        NEW

    </span>

</div>

<div class="gc-card__body">

    ${renderProductTitle(product)}

    ${renderProductMerchant(product)}

    <div class="gc-card__footer">

        ${renderProductPrice(product)}

        <button
    class="gc-card__add"
    data-view-uid="${product.view_uid}"
    onclick="event.preventDefault(); event.stopPropagation(); GocesCart.add(this);">

    +

</button>

    </div>

</div>

</a>

`;

}

module.exports = renderProductCard;