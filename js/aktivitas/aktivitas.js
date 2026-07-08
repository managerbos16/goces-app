const gcsNativeActivityInit = () => {
    const buttons = document.querySelectorAll('.gcsNativeActivitySegmentButton');
    const panels = document.querySelectorAll('.gcsNativeActivityPanel');

    const gcsNativeActivitySwitchTab = (target) => {
        buttons.forEach(btn => {
            btn.classList.toggle('gcsNativeActivitySegmentButtonActive', btn.dataset.tab === target);
        });

        panels.forEach(panel => {
            panel.classList.remove('gcsNativeActivityPanelActive');
            if (panel.id === `gcsNativeActivity${target.charAt(0).toUpperCase() + target.slice(1)}Panel`) {
                panel.classList.add('gcsNativeActivityPanelActive');
            }
        });
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            gcsNativeActivitySwitchTab(button.dataset.tab);
        });
    });

    // Default state
    gcsNativeActivitySwitchTab('purchase');
};

document.addEventListener('DOMContentLoaded', gcsNativeActivityInit);