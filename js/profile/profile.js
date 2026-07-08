/**
 * GOCES Profile Page Interactions
 * Murni Vanilla JavaScript Tanpa Library / Dependency Luar
 */

document.addEventListener('DOMContentLoaded', () => {
    gcsProfileInit();
});

/**
 * Inisialisasi Fungsi Utama
 */
function gcsProfileInit() {
    gcsProfileApplyRippleEffect();
    gcsProfileApplyIOSPressAnimation();
}

/**
 * Membuat efek Ripple khas saat elemen navigasi utama di-klik
 */
function gcsProfileApplyRippleEffect() {
    const gcsProfileRippleTargets = document.querySelectorAll('.gcsProfileBackButton, .gcsProfileSettingButton, .gcsProfileMenuCard, .gcsProfileWalletCard');

    gcsProfileRippleTargets.forEach(target => {
        target.addEventListener('click', function (e) {
            // Bersihkan sisa elemen ripple sebelumnya jika ada
            const gcsProfileExistingRipple = this.querySelector('.gcsProfileRipple');
            if (gcsProfileExistingRipple) {
                gcsProfileExistingRipple.remove();
            }

            const gcsProfileRippleSpan = document.createElement('span');
            gcsProfileRippleSpan.classList.add('gcsProfileRipple');

            // Hitung koordinat klik dalam area card
            const gcsProfileBounds = this.getBoundingClientRect();
            const gcsProfileSize = Math.max(gcsProfileBounds.width, gcsProfileBounds.height);

            gcsProfileRippleSpan.style.width = gcsProfileRippleSpan.style.height = `${gcsProfileSize}px`;

            const gcsProfileX = e.clientX - gcsProfileBounds.left - (gcsProfileSize / 2);
            const gcsProfileY = e.clientY - gcsProfileBounds.top - (gcsProfileSize / 2);

            gcsProfileRippleSpan.style.left = `${gcsProfileX}px`;
            gcsProfileRippleSpan.style.top = `${gcsProfileY}px`;

            this.appendChild(gcsProfileRippleSpan);

            // Bersihkan objek span ripple dari DOM saat animasi selesai
            gcsProfileRippleSpan.addEventListener('animationend', () => {
                gcsProfileRippleSpan.remove();
            });
        });
    });
}

/**
 * Menerapkan efek kompresi taktil (Scale Pressed) ala iOS App Native saat disentuh
 */
function gcsProfileApplyIOSPressAnimation() {
    const gcsProfileCards = document.querySelectorAll('.gcsProfileMenuCard, .gcsProfileWalletCard');

    gcsProfileCards.forEach(card => {
        // Event pendeteksi interaksi mobile touch
        card.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.965)';
            this.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
        }, { passive: true });

        card.addEventListener('touchend', function () {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
        }, { passive: true });

        // Kompatibilitas interaksi kursor desktop mouse click state
        card.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.965)';
            this.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
        });

        card.addEventListener('mouseup', function () {
            this.style.transform = '';
            this.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}