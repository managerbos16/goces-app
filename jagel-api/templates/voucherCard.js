function renderVoucherCard(voucher) {

    const ribbon =
        voucher.ribbon
            ? `
<div class="gcv-ribbon gcv-ribbon--${voucher.ribbon.toLowerCase()}">

    ${voucher.ribbon}

</div>
`
            : "";

    const badge =
        voucher.badge
            ? `
<span class="gcv-badge gcv-badge--${(voucher.badgeType || "discount").toLowerCase()}">

    ${voucher.badge}

</span>
`
            : "";

    const tag =
        voucher.tag
            ? `
<span class="gcv-tag gcv-tag--${(voucher.tagType || "hot").toLowerCase()}">

    ${voucher.tag}

</span>
`
            : "";

    return `

<div
    class="gcv-card"
    data-id="${voucher.id}"
    data-code="${voucher.code}"
    data-start="${voucher.startDate}"
    data-end="${voucher.endDate}"
    data-title="${voucher.title}"
    data-description="${voucher.description}"
    data-min-order="${voucher.minimumOrder}"
    data-max-discount="${voucher.maximumDiscount}"
    data-period="${voucher.period}"
    data-image="${voucher.image}"
    data-terms='${JSON.stringify(voucher.terms || [])}'>

    ${ribbon}

    <div class="gcv-image">

        <img
            src="${voucher.image}"
            alt="${voucher.title}">

    </div>

    <div class="gcv-card-divider"></div>

    <div class="gcv-content">

        <div class="gcv-top">

            ${badge}

            ${tag}

        </div>

        <h3 class="gcv-title">

            ${voucher.title}

        </h3>

        <p class="gcv-description">

            ${voucher.description}

        </p>

        <div class="gcv-period">

            ${voucher.period}

        </div>

        <div class="gcv-countdown">

            Memuat...

        </div>

    </div>

    <button
        class="gcv-copy">

        Salin

    </button>

</div>

`;

}

module.exports = renderVoucherCard;