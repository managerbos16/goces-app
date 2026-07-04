/* ==========================================================================
   GOCESPAY WALLET CONTROLLER
   Compatible with Jagel Android WebView
========================================================================== */

(function () {

    function initWallet() {

        const balance = document.getElementById("walletBalance");
        const toggle = document.getElementById("toggleBalance");

        if (!balance || !toggle) return;

        // Ambil saldo asli dari attribute data-balance
        const realBalance = balance.getAttribute("data-balance") || balance.innerText;

        const hiddenBalance = " ••••••••";

        // Default
        let isHidden = false;

        // Ambil status terakhir
        try {
            isHidden = localStorage.getItem("goces_wallet_hidden") === "true";
        } catch (e) {
            isHidden = false;
        }

        // Render tampilan
        function render(animated) {

            if (animated) {

                balance.style.opacity = "0";
                balance.style.transform = "translateY(2px)";

                setTimeout(function () {

                    balance.innerText = isHidden ? hiddenBalance : realBalance;

                    balance.style.opacity = "1";
                    balance.style.transform = "translateY(0)";

                }, 120);

            } else {

                balance.innerText = isHidden ? hiddenBalance : realBalance;

            }

            if (isHidden) {

                toggle.classList.add("blind-mode");

            } else {

                toggle.classList.remove("blind-mode");

            }

        }

        // Render pertama
        render(false);

        // Klik tombol mata
        toggle.onclick = function (e) {

            e.preventDefault();

            isHidden = !isHidden;

            try {

                localStorage.setItem(
                    "goces_wallet_hidden",
                    isHidden
                );

            } catch (err) { }

            render(true);

        };

    }

    // Aman untuk Browser & Jagel
    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", initWallet);

    } else {

        initWallet();

    }

})();