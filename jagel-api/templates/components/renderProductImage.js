function renderProductImage(product) {

    return `

<img
class="gc-card__img"
src="https://www.jagel.id/api/listimage/${product.image}"
alt="${product.title}">

`;

}

module.exports = renderProductImage;