const tabs = document.querySelectorAll('.gcsActivitySegmentButton');
const panels = document.querySelectorAll('.gcsActivityPanel');

const switchTab = (target) => {
    // Reset buttons
    tabs.forEach(tab => {
        tab.classList.remove('gcsActivitySegmentActive');
        if (tab.dataset.target === target) tab.classList.add('gcsActivitySegmentActive');
    });

    // Reset panels
    panels.forEach(panel => {
        panel.classList.remove('gcsActivityPanelActive');
        if (panel.id === `gcsActivityPanel${target.charAt(0).toUpperCase() + target.slice(1)}`) {
            panel.classList.add('gcsActivityPanelActive');
        }
    });
};

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        switchTab(e.target.dataset.target);
    });
});