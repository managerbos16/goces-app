const PromoApp = (() => {
    const state = { activeCat: 'semua', query: '' };
    const elements = {
        list: document.getElementById('gcsList'),
        chips: document.querySelectorAll('.gcs-chip'),
        counter: document.getElementById('gcsCounter'),
        search: document.getElementById('gcsSearch')
    };

    const init = () => {
        elements.chips.forEach(chip => chip.addEventListener('click', handleFilter));
        elements.search.addEventListener('input', handleSearch);
        render();
    };

    const handleFilter = (e) => {
        state.activeCat = e.target.dataset.cat;
        elements.chips.forEach(c => c.classList.toggle('active', c === e.target));
        render();
    };

    const handleSearch = (e) => {
        state.query = e.target.value.toLowerCase();
        render();
    };

    const render = () => {
        let count = 0;
        const items = elements.list.querySelectorAll('.gcs-card');

        items.forEach(item => {
            const matchesCat = state.activeCat === 'semua' || item.dataset.cat === state.activeCat;
            const matchesSearch = item.textContent.toLowerCase().includes(state.query);

            const isVisible = matchesCat && matchesSearch;
            item.classList.toggle('hidden', !isVisible);
            if (isVisible) count++;
        });

        // Animasi counter premium
        elements.counter.style.opacity = 0;
        setTimeout(() => {
            elements.counter.textContent = `${count} Voucher`;
            elements.counter.style.opacity = 1;
        }, 150);
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', PromoApp.init);