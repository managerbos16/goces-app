document.addEventListener('DOMContentLoaded', () => {
    initTabSystem();
    initNativeRippleEffects();
});

/**
 * Premium iOS Tab Interface Switching Architecture
 */
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-pill');
    const tabContents = document.querySelectorAll('.tab-content');

    // Trigger visual entry initialization on active view
    const initialActiveContent = document.querySelector('.tab-content.active');
    if (initialActiveContent) {
        setTimeout(() => {
            initialActiveContent.classList.add('show');
        }, 50);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Prevent process execution if tab selected is already active
            if (button.classList.contains('active')) return;

            // Step 1: Remove active states on pills UI context
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Step 2: Handle Content Fade out transitional sequence
            tabContents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.classList.remove('show');

                    // Delay layout swap after animation finishes (250ms)
                    setTimeout(() => {
                        content.classList.remove('active');

                        // Step 3: Trigger entrance on target layout framework
                        const nextContent = document.querySelector(`[data-content="${targetTab}"]`);
                        if (nextContent) {
                            nextContent.classList.add('active');
                            // Small trick to ensure display property registers before transition
                            setTimeout(() => {
                                nextContent.classList.add('show');
                            }, 20);
                        }
                    }, 250);
                }
            });
        });
    });
}

/**
 * Creates lightweight native physical UI response (Ripple logic)
 */
function initNativeRippleEffects() {
    const buttons = document.querySelectorAll('.icon-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Clear existing elements if user clicks consecutively rapidly
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = `${size}px`;

            const x = e.clientX - rect.left - (size / 2);
            const y = e.clientY - rect.top - (size / 2);

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            // Housekeeping cleanup memory leaks prevention
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}