/**
 * Arsitektur Interaksi Mikro halaman Chat GOCES
 */
document.addEventListener('DOMContentLoaded', () => {
    gcsChatInit();
});

/**
 * Fungsi Utama Inisialisasi Fitur Halaman Chat
 */
function gcsChatInit() {
    gcsChatInitRipple();
    gcsChatInitTouchFeedback();
}

/**
 * Mengaktifkan Efek Riak Taktil Ringan pada Tombol Lingkaran Action
 */
function gcsChatInitRipple() {
    const gcsChatButtons = document.querySelectorAll('.gcsChatActionButton');

    gcsChatButtons.forEach(gcsChatBtn => {
        gcsChatBtn.addEventListener('click', function (gcsChatEvent) {
            // Pembersihan elemen riak lama untuk optimasi memori runtime
            const gcsChatOldRipple = this.querySelector('.gcsChatRipple');
            if (gcsChatOldRipple) {
                gcsChatOldRipple.remove();
            }

            const gcsChatRippleElement = document.createElement('span');
            gcsChatRippleElement.classList.add('gcsChatRipple');

            const gcsChatRect = this.getBoundingClientRect();
            const gcsChatSize = Math.max(gcsChatRect.width, gcsChatRect.height);

            gcsChatRippleElement.style.width = gcsChatRippleElement.style.height = `${gcsChatSize}px`;

            const gcsChatX = gcsChatEvent.clientX - gcsChatRect.left - (gcsChatSize / 2);
            const gcsChatY = gcsChatEvent.clientY - gcsChatRect.top - (gcsChatSize / 2);

            gcsChatRippleElement.style.left = `${gcsChatX}px`;
            gcsChatRippleElement.style.top = `${gcsChatY}px`;

            this.appendChild(gcsChatRippleElement);

            // Detach node dari DOM ketika durasi keyframe selesai
            gcsChatRippleElement.addEventListener('animationend', () => {
                gcsChatRippleElement.remove();
            });
        });
    });
}

/**
 * Optimasi Akselerasi Taktil Layar Sentuh untuk Ekosistem Card iOS
 */
function gcsChatInitTouchFeedback() {
    const gcsChatCards = document.querySelectorAll('.gcsChatCard');

    gcsChatCards.forEach(gcsChatCardItem => {
        // Logika percepatan visual saat mendeteksi input touchstart mobile device
        gcsChatCardItem.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.97) translateY(0)';
        }, { passive: true });

        gcsChatCardItem.addEventListener('touchend', function () {
            this.style.transform = '';
        }, { passive: true });
    });
}