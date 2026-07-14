/*==================================
        GOCES VOUCHER CARD
==================================*/

window.renderVoucherCard = function (item) {

    return `

<div
class="gcv-card"
data-code="${item.code}"
data-title="${item.title}"
data-description="${item.description}"
data-image="${item.image}"
data-period="${item.period}"
data-minimum="${item.minimumOrder}"
data-maximum="${item.maximumDiscount}"
data-terms='${JSON.stringify(item.terms)}'>

    <div class="gcv-ribbon">

        ${item.ribbon}

    </div>

    <div class="gcv-image-wrap">

        <img

            class="gcv-image"

            src="${item.image}"

            alt="${item.title}">

    </div>

    <div class="gcv-content">

        <div class="gcv-tag ${item.tagType}">

            ${item.tag}

        </div>

        <div class="gcv-title">

            ${item.title}

        </div>

        <div class="gcv-description">

            ${item.description}

        </div>

        <div class="gcv-footer">

            <div>

                <div class="gcv-badge ${item.badgeType}">

                    ${item.badge}

                </div>

                <div class="gcv-period">

                    ${item.period}

                </div>

            </div>

            <button
            class="gcv-button">

                Pakai

            </button>

        </div>

    </div>

</div>

`;

};