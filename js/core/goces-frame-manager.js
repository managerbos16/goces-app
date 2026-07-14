window.addEventListener("message", function (e) {

    console.log("PESAN MASUK:", e.data);

    if (!e.data) return;

    if (e.data.type !== "goces-frame") return;

    const frame = document.getElementById("frame-" + e.data.page);

    if (!frame) {

        console.log("FRAME TIDAK DITEMUKAN");

        return;

    }

    console.log("TINGGI BARU:", e.data.height);

    frame.style.height = e.data.height + "px";

});