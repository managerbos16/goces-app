/**
 * Logika dan Interaksi Mikro Halaman Profile GOCES
 * Murni Vanilla JS, diisolasi dengan prefix gcsProfile
 */

document.addEventListener('DOMContentLoaded', () => {
    gcsProfileInit();
});

/**
 * Fungsi Utama Inisialisasi Halaman
 */
function gcsProfileInit() {
    gcsProfileInitRipple();
    gcsProfileInitTouchFeedback();
    gcsProfileInitHeaderActions();
}

/**
 * Menerapkan efek Ripple (riak air) pada tombol dengan class gcsProfileActionButton
 */
function gcsProfileInitRipple() {
    const gcsProfileButtons = document.querySelectorAll('.gcsProfileActionButton');

    gcsProfileButtons.forEach(gcsProfileBtn => {
        gcsProfileBtn.addEventListener('click', function (gcsProfileEvent) {
            // Hapus ripple lama agar tidak menumpuk saat di-klik berulang
            const gcsProfileOldRipple = this.querySelector('.gcsProfileRipple');
            if (gcsProfileOldRipple) {
                gcsProfileOldRipple.remove();
            }

            const gcsProfileRippleEl = document.createElement('span');
            gcsProfileRippleEl.classList.add('gcsProfileRipple');

            const gcsProfileRect = this.getBoundingClientRect();
            const gcsProfileSize = Math.max(gcsProfileRect.width, gcsProfileRect.height);

            gcsProfileRippleEl.style.width = gcsProfileRippleEl.style.height = `${gcsProfileSize}px`;

            const gcsProfileX = gcsProfileEvent.clientX - gcsProfileRect.left - (gcsProfileSize / 2);
            const gcsProfileY = gcsProfileEvent.clientY - gcsProfileRect.top - (gcsProfileSize / 2);

            gcsProfileRippleEl.style.left = `${gcsProfileX}px`;
            gcsProfileRippleEl.style.top = `${gcsProfileY}px`;

            this.appendChild(gcsProfileRippleEl);

            // Bersihkan elemen dari DOM setelah animasi berakhir
            gcsProfileRippleEl.addEventListener('animationend', () => {
                gcsProfileRippleEl.remove();
            });
        });
    });
}

/**
 * Mengoptimalkan feedback visual (scale) pada perangkat layar sentuh untuk card menu
 */
function gcsProfileInitTouchFeedback() {
    const gcsProfileCards = document.querySelectorAll('.gcsProfileMenuCard, .gcsProfileWalletCard');

    gcsProfileCards.forEach(gcsProfileCard => {
        gcsProfileCard.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.97) translateY(0)';
        }, { passive: true });

        gcsProfileCard.addEventListener('touchend', function () {
            this.style.transform = '';
        }, { passive: true });
    });
}

/**
 * Inisialisasi aksi pada tombol Header
 */
function gcsProfileInitHeaderActions() {
    const gcsProfileBackBtn = document.querySelector('.gcsProfileBackButton');
    const gcsProfileSettingBtn = document.querySelector('.gcsProfileSettingButton');

    if (gcsProfileBackBtn) {
        gcsProfileBackBtn.addEventListener('click', () => {
            // Simulasi fungsi back. Ganti dengan logika navigasi sebenarnya jika diperlukan.
            window.history.back();
        });
    }

    if (gcsProfileSettingBtn) {
        gcsProfileSettingBtn.addEventListener('click', () => {
            // Simulasi buka pengaturan
            window.location.href = 'privacy-settings.html';
        });
    }
}