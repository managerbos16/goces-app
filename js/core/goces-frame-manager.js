/*==================================
        GOCES FRAME MANAGER
==================================*/

window.addEventListener("message", function (event) {

    const data = event.data;

    if (!data) return;

    if (data.type !== "goces-frame") return;

    const frame = document.getElementById("frame-" + data.page);

    if (!frame) return;

    // Tidak ada produk
    if (data.empty) {

        frame.style.display = "none";
        frame.style.height = "0px";

        return;

    }

    // Ada produk
    frame.style.display = "block";
    frame.style.height = data.height + "px";

});