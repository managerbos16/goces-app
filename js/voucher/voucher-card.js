/* GOCES VOUCHER CARD */
(function () {
  function getVoucherVisual(voucher) {
    const identity = [
      voucher.title,
      voucher.description,
      voucher.badge,
      voucher.badgeType,
      voucher.tag,
      voucher.tagType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (/ride|motor/.test(identity))
      return { type: "ride", icon: "ph-motorcycle" };
    if (/car|mobil/.test(identity)) return { type: "car", icon: "ph-car" };
    if (/pay|pulsa|wallet|dompet|tagihan/.test(identity))
      return { type: "pay", icon: "ph-wallet" };
    if (/delivery|kirim|antar/.test(identity))
      return { type: "delivery", icon: "ph-package" };
    if (/kopi|coffee|cemilan|snack/.test(identity))
      return { type: "food", icon: "ph-coffee" };
    return { type: "food", icon: "ph-hamburger" };
  }
  function getOfferLabel(voucher) {
    const badge = String(voucher.badge || "").trim();
    if (badge)
      return badge.replace(/^diskon\s*/i, "").replace(/\s*cashback$/i, "");
    if (Number(voucher.maximumDiscount) > 0)
      return "Rp " + Math.round(Number(voucher.maximumDiscount) / 1000) + "rb";
    return "PROMO";
  }
  window.renderVoucherCard = function (voucher) {
    const visual = getVoucherVisual(voucher);
    const offer = getOfferLabel(voucher);
    return `
<div class="gcv-card" data-id="${voucher.id}" data-status="${voucher.status}" data-priority="${voucher.priority}" data-code="${voucher.code}" data-title="${voucher.title}" data-description="${voucher.description}" data-image="${voucher.image}" data-period="${voucher.period}" data-minimum="${voucher.minimumOrder}" data-maximum="${voucher.maximumDiscount}" data-start="${voucher.startDate}" data-end="${voucher.endDate}" data-terms='${JSON.stringify(voucher.terms || [])}'>
    <div class="gcv-ticket-visual gcv-ticket--${visual.type}">
        <i class="ph-fill ${visual.icon}" aria-hidden="true"></i>
        <span>${offer}</span>
    </div>
    <div class="gcv-content">
        <h3 class="gcv-title">${voucher.title}</h3>
        <p class="gcv-description">${voucher.description}</p>
        <div class="gcv-period">${voucher.period}</div>
        <div class="gcv-ticket-bottom">
            <div class="gcv-countdown"></div>
            <button type="button" class="gcv-copy"><i class="ph-bold ph-copy" aria-hidden="true"></i><span>Salin</span></button>
        </div>
    </div>
</div>`;
  };
})();
