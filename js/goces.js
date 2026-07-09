(function () {

    const scripts = [

        "/js/router.js",
        "/js/navigation.js",
        "/js/feedback.js",
        "/js/app.js",

        "/js/home/header.js",
        "/js/home/wallet.js",
        "/js/home/shortcut.js",
        "/js/home/slider.js",

        "/kuliner.js",

        "/js/food/food.js",
        "/js/shop/shop.js",
        "/js/fresh/fresh.js",

        "/js/goride/goride.js",
        "/js/gocar/gocar.js",
        "/js/delivery/delivery.js",

        "/js/lainnya/lainnya.js",
        "/js/ppob/ppob.js",

        "/js/promo/promo.js",
        "/js/aktivitas/aktivitas.js",
        "/js/chat/chat.js",
        "/js/profile/profile.js",

        "/js/benner-home/benner-home.js",
        "/js/benner-food/benner-food.js",
        "/js/benner-shop/benner-shop.js",
        "/js/benner-fresh/benner-fresh.js",
        "/js/benner-ppob/benner-ppob.js",
        "/js/benner-promo/benner-promo.js",

        "/js/voucher-gorider/voucher-gorider.js",
        "/js/voucher-gocar/voucher-gocar.js",
        "/js/voucher-gofood/voucher-gofood.js",
        "/js/voucher-delivery/voucher-delivery.js",
        "/js/voucher-shop/voucher-shop.js",
        "/js/voucher-fresh/voucher-fresh.js",
        "/js/voucher-ppob/voucher-ppob.js"

    ];

    let index = 0;

    function loadNext() {

        if (index >= scripts.length) return;

        const script = document.createElement("script");

        script.src = "https://goces-app.vercel.app" + scripts[index];

        script.onload = function () {

            index++;

            loadNext();

        };

        script.onerror = function () {

            console.error("Gagal memuat :", scripts[index]);

            index++;

            loadNext();

        };

        document.body.appendChild(script);

    }

    loadNext();

})();