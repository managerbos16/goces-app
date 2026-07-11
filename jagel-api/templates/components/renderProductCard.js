const renderProductImage = require("./renderProductImage");
const renderProductTitle = require("./renderProductTitle");
const renderProductMerchant = require("./renderProductMerchant");
const renderProductPrice = require("./renderProductPrice");

function renderProductCard(product) {

    return `

<div class="gc-card">

    <a
        class="gc-card__link"
        href="action://p/${product.view_uid}">

        <div class="gc-card__image">

            ${renderProductImage(product)}

            <button
                type="button"
                class="gc-card__favorite">

                ♡

            </button>

            <span class="gc-card__badge">

                NEW

            </span>

        </div>

        <div class="gc-card__body">

            ${renderProductTitle(product)}

            ${renderProductMerchant(product)}

        </div>

    </a>

    <div class="gc-card__footer">

        ${renderProductPrice(product)}

        <button
    type="button"
    class="gc-card__add"
    data-view-uid="${product.view_uid}"
    onclick="alert(typeof GocesCart)">

    +

</button>

    </div>

</div>

`;

}

module.exports = renderProductCard;