window.addEventListener("message", function (e) {

    if (!e.data) return;

    if (e.data.type !== "goces-frame") return;

    const page = e.data.page;

    const frame = document.getElementById("frame-" + page);

    const section = document.getElementById("section-" + page);

    if (!frame || !section) return;

    if (e.data.empty) {

        section.style.display = "none";

        return;

    }

    section.style.display = "";

    frame.style.height = e.data.height + "px";

});