/**
 * GOCES Activity Page Module
 * Engineered with high-performance event delegation, passive listeners,
 * and Apple-inspired UX guidelines.
 */

document.addEventListener('DOMContentLoaded', () => {
    gcsActivityInit();
});

function gcsActivityInit() {
    const tabsContainer = document.querySelector('.gcsActivityTabs');
    const actionButtons = [
        { id: 'gcsActivityBtnPurchaseAction', callback: gcsActivityOpenPurchase },
        { id: 'gcsActivityBtnBalanceAction', callback: gcsActivityOpenBalance },
        { id: 'gcsActivityBtnPointAction', callback: gcsActivityOpenPoint }
    ];

    // Trigger initial animation for first active section immediately
    const initialActiveSection = document.querySelector('.gcsActivitySectionActive');
    if (initialActiveSection) {
        requestAnimationFrame(() => {
            initialActiveSection.classList.add('gcsActivitySectionVisible');
        });
    }

    // Event Delegation for Segmented Control Tabs
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (event) => {
            const targetTab = event.target.closest('.gcsActivityTabButton');
            if (targetTab && !targetTab.classList.contains('gcsActivityTabActive')) {
                gcsActivitySwitchTab(targetTab);
            }
        }, { passive: true });
    }

    // Bind Actions to Placeholder functions with Native Ripple Effect
    actionButtons.forEach(btn => {
        const btnElement = document.getElementById(btn.id);
        if (btnElement) {
            btnElement.addEventListener('click', (event) => {
                gcsActivityInjectRipple(event, btnElement);
                // Delay callback execution to let ripple animation breathe
                setTimeout(() => {
                    btn.callback();
                }, 150);
            });
        }
    });
}

/**
 * High-Performance Tab Switching with iOS Frame Motion
 */
function gcsActivitySwitchTab(selectedTabButton) {
    const allTabs = document.querySelectorAll('.gcsActivityTabButton');
    const allSections = document.querySelectorAll('.gcsActivitySection');
    const targetPanelId = selectedTabButton.getAttribute('aria-controls');
    const targetSection = document.getElementById(targetPanelId);

    // 1. Update State Profile on Tabs
    allTabs.forEach(tab => {
        tab.classList.remove('gcsActivityTabActive');
        tab.setAttribute('aria-selected', 'false');
    });
    selectedTabButton.classList.add('gcsActivityTabActive');
    selectedTabButton.setAttribute('aria-selected', 'true');

    // 2. Perform Fluid Out-In Animation Block via CSS Lifecycle Matrix
    allSections.forEach(section => {
        if (section.classList.contains('gcsActivitySectionActive')) {
            section.classList.remove('gcsActivitySectionVisible');

            // Listen for the cleanest performance fade-out finish
            const onFadeOutEnd = (e) => {
                if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
                    section.classList.remove('gcsActivitySectionActive');
                    section.setAttribute('aria-hidden', 'true');
                    section.removeEventListener('transitionend', onFadeOutEnd);

                    // Trigger inbound component animation context smoothly
                    gcsActivityRevealSection(targetSection);
                }
            };
            section.addEventListener('transitionend', onFadeOutEnd);
        }
    });
}

/**
 * Utility to properly handle incoming micro-animation sequencing
 */
function gcsActivityRevealSection(targetSection) {
    if (!targetSection) return;

    targetSection.classList.add('gcsActivitySectionActive');
    targetSection.removeAttribute('aria-hidden');

    // Ensure DOM registers display:block before rendering CSS Transforms
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            targetSection.classList.add('gcsActivitySectionVisible');
        });
    });
}

/**
 * Premium Liquid UI Ripple Engine
 */
function gcsActivityInjectRipple(event, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('gcsActivityRipple');

    // Clear older ripples to avoid unnecessary RAM profile bloating
    const currentRipple = button.querySelector('.gcsActivityRipple');
    if (currentRipple) {
        currentRipple.remove();
    }

    button.appendChild(circle);
}

/**
 * ACTION PLACEHOLDERS
 */
function gcsActivityOpenPurchase() {
    console.log('[Native Route Request] Navigating to: activity://purchase_history');
    alert('Membuka Halaman Riwayat Pembelian...');
}

function gcsActivityOpenBalance() {
    console.log('[Native Route Request] Navigating to: activity://gcespay_history');
    alert('Membuka Halaman Riwayat Transaksi Saldo...');
}

function gcsActivityOpenPoint() {
    console.log('[Native Route Request] Navigating to: activity://points_rewards');
    alert('Membuka Halaman Riwayat Perolehan Poin...');
}