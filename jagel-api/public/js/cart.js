/*==================================================
                GOCES CART
==================================================*/

document.addEventListener("click", function (e) {

    const button = e.target.closest(".gc-card__add");

    if (!button) return;

    e.preventDefault();
    e.stopPropagation();

    button.classList.add("gc-card__add--active");

    setTimeout(() => {

        button.classList.remove("gc-card__add--active");

    }, 180);

});