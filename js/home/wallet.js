/* ==========================================================================
   GOCESPAY WALLET CARD - PREMIUM CONTROLLER MODULE
========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const eyeTrigger = document.getElementById("toggleBalance");
    const displayField = document.getElementById("walletBalance");

    if (eyeTrigger && displayField) {
        // Safe string tracking mapped dynamically from original Jagel node
        const realBalanceValue = displayField.textContent.trim();
        const secureMaskString = "Rp ••••••••";

        // Query state synchronization from continuous disk engine
        let isWalletMasked = localStorage.getItem("goces_mask_preference") === "true";

        // UI Pipeline Execution Thread
        const renderingEnginePipeline = (executeAnimation = false) => {
            if (executeAnimation) {
                // Fluent fluid mechanical micro-fade transitions
                displayField.style.transition = "opacity 0.12s ease, transform 0.12s ease";
                displayField.style.opacity = "0";
                displayField.style.transform = "translateY(1.5px)";

                setTimeout(() => {
                    displayField.textContent = isWalletMasked ? secureMaskString : realBalanceValue;
                    displayField.style.opacity = "1";
                    displayField.style.transform = "translateY(0)";
                }, 110);
            } else {
                displayField.textContent = isWalletMasked ? secureMaskString : realBalanceValue;
            }

            // Sync structural controller attributes to the toggle layout wrapper
            if (isWalletMasked) {
                eyeTrigger.classList.add("blind-mode");
            } else {
                eyeTrigger.classList.remove("blind-mode");
            }
        };

        // Initialize display configuration state array safely
        renderingEnginePipeline(false);

        // Core Interaction Layer
        eyeTrigger.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();

            isWalletMasked = !isWalletMasked;
            localStorage.setItem("goces_mask_preference", isWalletMasked);

            renderingEnginePipeline(true);
        });
    }
});