/**
 * Food GOCES v0.2
 * Native-Safe JavaScript Architecture (No Scroll Locks)
 */

const foodv02State = {
    searchTimer: null
};

function foodv02Init() {
    foodv02BindEvents();
}

function foodv02BindEvents() {
    // Category Click Event
    const categoryChips = document.querySelectorAll('.foodv02CategoryChip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', function (e) {
            const category = this.getAttribute('data-category');
            foodv02ShowCategory(category, categoryChips, this);
        });
    });

    // Search Event (Realtime)
    const searchInput = document.getElementById('foodv02SearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            clearTimeout(foodv02State.searchTimer);
            foodv02State.searchTimer = setTimeout(() => {
                foodv02Search(this.value);
            }, 150); // Debounce ringan agar performa tetap halus
        });
    }

    // Ripple Event
    const rippleTargets = document.querySelectorAll('.foodv02RippleTarget');
    rippleTargets.forEach(target => {
        target.addEventListener('mousedown', foodv02Ripple);
        target.addEventListener('touchstart', foodv02Ripple, { passive: true });
    });
}

function foodv02ShowCategory(categoryName, allChips, activeChip) {
    // Update Chips Style
    allChips.forEach(c => c.classList.remove('foodv02Active'));
    activeChip.classList.add('foodv02Active');

    // Center chip in scroll area
    activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // Hide all sections
    const allSections = document.querySelectorAll('.foodv02MenuSection');
    allSections.forEach(section => {
        section.classList.remove('foodv02ActiveSection');
        // Timeout untuk membiarkan CSS transition selesai
        setTimeout(() => {
            if (!section.classList.contains('foodv02ActiveSection')) {
                section.style.display = 'none';
            }
        }, 250);
    });

    // Show target section
    const targetSection = document.getElementById(`foodv02Section-${categoryName}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Trigger reflow untuk animasi fade-in
        void targetSection.offsetWidth;
        targetSection.classList.add('foodv02ActiveSection');
    }
}

function foodv02Search(query) {
    const q = query.toLowerCase().trim();
    const allCards = document.querySelectorAll('.foodv02ProductCard');

    allCards.forEach(card => {
        const foodNameEl = card.querySelector('.foodv02FoodName');
        const merchantNameEl = card.querySelector('.foodv02MerchantName');

        let isMatch = false;
        if (foodNameEl && foodNameEl.innerText.toLowerCase().includes(q)) isMatch = true;
        if (merchantNameEl && merchantNameEl.innerText.toLowerCase().includes(q)) isMatch = true;

        if (isMatch || q === '') {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function foodv02Ripple(e) {
    // Hanya proses sentuhan pertama untuk touch event
    let x, y;
    if (e.type === 'touchstart') {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();

    const ripple = document.createElement('span');
    ripple.classList.add('foodv02Ripple');

    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x - rect.left - radius}px`;
    ripple.style.top = `${y - rect.top - radius}px`;

    // Hapus ripple lama agar tidak menumpuk di DOM
    const existingRipple = btn.querySelector('.foodv02Ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    btn.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600); // Sesuai durasi animasi CSS
}

// Jalankan inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', foodv02Init);