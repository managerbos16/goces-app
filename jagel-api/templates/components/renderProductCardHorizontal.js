const renderProductImage = require("./renderProductImage");
const renderProductTitle = require("./renderProductTitle");
const renderProductMerchant = require("./renderProductMerchant");
const renderProductPrice = require("./renderProductPrice");
const renderProductPromo = require("./renderProductPromo");
const renderProductDescription = require("./renderProductDescription");

function renderProductCardHorizontal(product) {

    return `

<div class="gch-card">

    <a
        class="gch-card__link"
        href="action://p/${product.view_uid}">

        <div class="gch-card__image">

            ${renderProductImage(product)}

            ${renderProductPromo(product)}

            <span class="gc-card__badge">

                NEW

            </span>

        </div>

        <div class="gch-card__body">

            ${renderProductTitle(product)}

            ${renderProductDescription(product)}

            ${renderProductMerchant(product)}

        </div>

    </a>

    <div class="gch-card__footer">

        ${product.type === 4 ? `

            <a
                class="gc-card__shop"
                href="action://p/${product.view_uid}">

                Lihat Toko

            </a>

        ` : `

            ${renderProductPrice(product)}

            <button
                type="button"
                class="gc-card__add"
                data-view-uid="${product.view_uid}">

                +

            </button>

        `}

    </div>

</div>

`;

}

module.exports = renderProductCardHorizontal;