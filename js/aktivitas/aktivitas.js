function gcsNativeActivityInit() {
    const activityPage = document.querySelector("#page-aktivitas");
    const segments = activityPage.querySelectorAll(".gcsNativeActivitySegmentButton");
    const panels = activityPage.querySelectorAll(".gcsNativeActivityPanel");

    segments.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class
            segments.forEach(s => s.classList.remove("gcsNativeActivitySegmentButtonActive"));
            panels.forEach(p => p.classList.remove("gcsNativeActivityPanelActive"));

            // Add active class
            btn.classList.add("gcsNativeActivitySegmentButtonActive");
            const target = btn.getAttribute("data-target");
            activityPage.querySelector(`#gcsNativeActivityPanel${target.charAt(0).toUpperCase() + target.slice(1)}`)
                .classList.add("gcsNativeActivityPanelActive");
        });
    });
}