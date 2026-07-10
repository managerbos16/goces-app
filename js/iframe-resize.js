/*==================================
        GOCES IFRAME RESIZE
==================================*/

window.addEventListener("message", function (event) {

    if (!event.data) return;

    if (event.data.type !== "goces-resize") return;

    const page = event.data.page;

    const height = event.data.height;

    const frame = document.getElementById("frame-" + page);

    if (!frame) return;

    frame.style.height = height + "px";

});