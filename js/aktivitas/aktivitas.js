(function () {
    "use strict";

    function gcsActivityInit() {
        const segments = document.querySelectorAll('.gcsActivitySegmentButton');
        const panels = document.querySelectorAll('.gcsActivityPanel');

        segments.forEach(btn => {
            btn.addEventListener('click', () => {
                // UI Toggle
                segments.forEach(s => s.classList.remove('gcsActivitySegmentActive'));
                btn.classList.add('gcsActivitySegmentActive');

                // Panel Toggle
                const target = btn.dataset.target;
                panels.forEach(p => {
                    p.classList.remove('gcsActivityPanelActive');
                    if (p.id === `gcsActivity${target.charAt(0).toUpperCase() + target.slice(1)}Panel`) {
                        p.classList.add('gcsActivityPanelActive');
                    }
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', gcsActivityInit);
})();