/**
 * Food GOCES - Production Ready JavaScript
 * Arsitektur modular, event delegation, dan performance optimized (requestAnimationFrame)
 */

let foodv02CurrentPage = 'foodv02SectionSemua';
let foodv02SearchTimeout = null;

function foodv02Init() {
    foodv02InitBanner();
    foodv02BindEvents();
}

function foodv02BindEvents() {
    // Event Delegation untuk Category Button
    const categoryWrapper = document.getElementById('foodv02CategoryWrapper');
    if (categoryWrapper) {
        categoryWrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('.foodv02CategoryButton');
            if (!btn) return;

            const targetSection = btn.getAttribute('data-target');
            if (targetSection && targetSection !== foodv02CurrentPage) {
                foodv02ActivateCategory(btn, targetSection);
            }
        });
    }

    // Ripple Effect Delegation
    document.addEventListener('click', (e) => {
        const rippleTarget = e.target.closest('.foodv02RippleTarget');
        if (rippleTarget) {
            foodv02RippleEffect(e, rippleTarget);
        }
    });

    // Realtime Search Filtering
    const searchInput = document.getElementById('foodv02Search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(foodv02SearchTimeout);
            foodv02SearchTimeout = setTimeout(() => {
                foodv02SearchFilter(e.target.value.toLowerCase());
            }, 150); // Debounce ringan
        });
    }
}

function foodv02ActivateCategory(btn, targetSection) {
    // Update Button Active State
    document.querySelectorAll('.foodv02CategoryButton').forEach(el => {
        el.classList.remove('foodv02CategoryActive');
    });
    btn.classList.add('foodv02CategoryActive');

    // Center the chip
    foodv02CenterActiveChip(btn);

    // Show Page
    foodv02ShowPage(targetSection);
}

function foodv02ShowPage(pageId) {
    const currentSection = document.getElementById(foodv02CurrentPage);
    const nextSection = document.getElementById(pageId);

    if (!nextSection) return;

    requestAnimationFrame(() => {
        // Hilangkan halaman lama (Transisi dilakukan oleh CSS)
        if (currentSection) {
            currentSection.classList.remove('foodv02SectionActive');
        }

        // Tampilkan halaman baru
        nextSection.classList.add('foodv02SectionActive');
        foodv02CurrentPage = pageId;
    });
}

function foodv02CenterActiveChip(btn) {
    const wrapper = document.getElementById('foodv02CategoryWrapper');
    if (!wrapper || !btn) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Hitung posisi tengah agar persis seperti behavior scroll iOS
    const scrollLeftPos = btn.offsetLeft - (wrapperRect.width / 2) + (btnRect.width / 2);

    wrapper.scrollTo({
        left: scrollLeftPos,
        behavior: 'smooth'
    });
}

function foodv02SearchFilter(keyword) {
    // Pastikan kita kembali ke tab 'Semua' saat melakukan pencarian
    if (foodv02CurrentPage !== 'foodv02SectionSemua') {
        const btnSemua = document.querySelector('.foodv02CategoryButton[data-target="foodv02SectionSemua"]');
        if (btnSemua) foodv02ActivateCategory(btnSemua, 'foodv02SectionSemua');
    }

    const cards = document.querySelectorAll('#foodv02SectionSemua .foodv02Card');

    requestAnimationFrame(() => {
        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const merchant = card.getAttribute('data-merchant').toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();

            if (name.includes(keyword) || merchant.includes(keyword) || tags.includes(keyword)) {
                card.style.display = 'block';
                // Trigger reflow untuk animasi masuk kembali
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
}

function foodv02InitBanner() {
    const container = document.getElementById('foodv02BannerContainer');
    if (!container) return;

    // Injeksi elemen via JS agar sesuai permintaan (tanpa gambar statis di HTML)
    // Untuk production, Anda bisa memodifikasi ini menjadi slider
    const imgUrl = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80';

    requestAnimationFrame(() => {
        container.innerHTML = `
            <img src="${imgUrl}" alt="Promo GOCES" class="foodv02BannerItem">
        `;
    });
}

function foodv02RippleEffect(event, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    // Perhitungan posisi klik yang akurat
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('foodv02Ripple');

    // Mencegah ripple menumpuk berlebihan (optimasi DOM)
    const existingRipple = button.querySelector('.foodv02Ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(circle);

    // Hapus span setelah animasi selesai agar DOM tetap bersih
    setTimeout(() => {
        if (circle.parentNode === button) {
            circle.remove();
        }
    }, 600);
}

// Inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', foodv02Init);