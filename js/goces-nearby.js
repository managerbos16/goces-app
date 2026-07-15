/*==================================
        GOCES NEARBY SECTION
==================================*/

window.GocesNearby = {

    update() {

        const section = document.getElementById(
            "gprNearbySection"
        );

        const container = document.getElementById(
            "gprNearbyContainer"
        );

        if (!section || !container) return;

        const total = container.querySelectorAll(
            ".item-nearby-row"
        ).length;

        if (total > 0) {

            section.style.display = "";

        } else {

            section.style.display = "none";

        }

    }

};

document.addEventListener(

    "DOMContentLoaded",

    function () {

        GocesNearby.update();

    }

);