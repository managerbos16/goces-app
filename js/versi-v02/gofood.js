/**
 * Food GOCES - Production Ready JavaScript
 * Modular, performant (RAF), dan tidak mengunci scroll behavior default.
 */

let foodv02CurrentPage = 'foodv02SectionSemua';
let foodv02SearchTimeout = null;

function foodv02Init() {
    foodv02InitBanner();
    foodv02BindEvents();
}

function foodv02BindEvents() {
    // Event Delegation untuk Tab Kategori
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

    // Event Delegation untuk Ripple Effect
    document.addEventListener('mousedown', (e) => {
        const rippleTarget = e.target.closest('.foodv02RippleTarget');
        if (rippleTarget) {
            foodv02Ripple(e, rippleTarget);
        }
    });

    // Support Touch device
    document.addEventListener('touchstart', (e) => {
        const rippleTarget = e.target.closest('.foodv02RippleTarget');
        if (rippleTarget) {
            foodv02Ripple(e.touches[0], rippleTarget);
        }
    }, { passive: true }); // passive true memastikan scroll tidak diblok

    // Realtime Search Filtering
    const searchInput = document.getElementById('foodv02Search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(foodv02SearchTimeout);
            foodv02SearchTimeout = setTimeout(() => {
                foodv02SearchFilter(e.target.value.toLowerCase());
            }, 150); // Debounce optimal
        });
    }
}

function foodv02ActivateCategory(btn, targetSection) {
    // Update Button Active State
    document.querySelectorAll('.foodv02CategoryButton').forEach(el => {
        el.classList.remove('foodv02CategoryActive');
    });
    btn.classList.add('foodv02CategoryActive');

    foodv02CenterActiveChip(btn);
    foodv02ShowPage(targetSection);
}

function foodv02ShowPage(pageId) {
    const currentSection = document.getElementById(foodv02CurrentPage);
    const nextSection = document.getElementById(pageId);

    if (!nextSection) return;

    requestAnimationFrame(() => {
        // Logika Tab tanpa menyebabkan reflow/reload (CSS Transition menghandle sisanya)
        if (currentSection) {
            currentSection.classList.remove('foodv02SectionActive');
        }

        nextSection.classList.add('foodv02SectionActive');
        foodv02CurrentPage = pageId;
    });
}

function foodv02CenterActiveChip(btn) {
    const wrapper = document.getElementById('foodv02CategoryWrapper');
    if (!wrapper || !btn) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const scrollLeftPos = btn.offsetLeft - (wrapperRect.width / 2) + (btnRect.width / 2);

    wrapper.scrollTo({
        left: scrollLeftPos,
        behavior: 'smooth'
    });
}

function foodv02SearchFilter(keyword) {
    // Jika mencari, pastikan kita ada di tab "Semua"
    if (foodv02CurrentPage !== 'foodv02SectionSemua' && keyword.length > 0) {
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
    const dotContainer = document.getElementById('foodv02DotContainer');
    if (!container || !dotContainer) return;

    // Sesuai gambar referensi: Rasio 16:7 dan gambar Pizza
    const imgUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80';

    requestAnimationFrame(() => {
        container.innerHTML = `<img src="${imgUrl}" alt="Promo GOCES" class="foodv02BannerItem">`;

        // Dot indicator (Contoh 3 slide, slide pertama aktif)
        dotContainer.innerHTML = `
            <div class="foodv02Dot foodv02DotActive"></div>
            <div class="foodv02Dot"></div>
            <div class="foodv02Dot"></div>
        `;
    });
}

function foodv02Ripple(event, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    // Perhitungan posisi akurat, menahan error fallback ke tengah
    const clientX = event.clientX || (rect.left + radius);
    const clientY = event.clientY || (rect.top + radius);

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${clientX - rect.left - radius}px`;
    circle.style.top = `${clientY - rect.top - radius}px`;
    circle.classList.add('foodv02Ripple');

    const existingRipple = button.querySelector('.foodv02Ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(circle);

    setTimeout(() => {
        if (circle.parentNode === button) {
            circle.remove();
        }
    }, 500);
}

// Inisialisasi
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', foodv02Init);
} else {
    foodv02Init();
}