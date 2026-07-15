const gcsHalamanPromoBannerData = [
    {
        image: "https://res.cloudinary.com/dutuhbbg2/image/upload/v1784097642/ChatGPT_Image_15_Jul_2026_14.39.32_yp5ijn.png",
        link: "promo-detail-1.html",
        start: "2026-07-01 00:00:00",
        end: "2027-07-31 23:59:59"
    }

];

let gcsHalamanPromoBannerCurrentIndex = 0;
let gcsHalamanPromoBannerActiveItems = [];
let gcsHalamanPromoBannerTimer = null;
let gcsHalamanPromoBannerScheduleTimer = null;
let gcsHalamanPromoBannerTouchStartX = 0;
let gcsHalamanPromoBannerTouchEndX = 0;

document.addEventListener("DOMContentLoaded", () => {
    gcsHalamanPromoBannerInit();
});

function gcsHalamanPromoBannerInit() {
    gcsHalamanPromoBannerRefresh();

    clearInterval(gcsHalamanPromoBannerScheduleTimer);

    gcsHalamanPromoBannerScheduleTimer = setInterval(() => {
        gcsHalamanPromoBannerRefresh();
    }, 60000);
}

function gcsHalamanPromoBannerRefresh() {
    gcsHalamanPromoBannerActiveItems =
        gcsHalamanPromoBannerCheckSchedule(
            gcsHalamanPromoBannerData
        );

    gcsHalamanPromoBannerCurrentIndex = 0;

    gcsHalamanPromoBannerRender(
        gcsHalamanPromoBannerActiveItems
    );
}

function gcsHalamanPromoBannerCheckSchedule(bannerList) {
    const now = Date.now();

    return bannerList.filter(item => {
        const start = new Date(
            item.start.replace(" ", "T")
        ).getTime();

        const end = new Date(
            item.end.replace(" ", "T")
        ).getTime();

        return Number.isFinite(start) &&
            Number.isFinite(end) &&
            now >= start &&
            now <= end;
    });
}

function gcsHalamanPromoBannerRender(activeBanners) {
    const wrapper = document.getElementById(
        "gcsHalamanPromoBannerContainer"
    );

    if (!wrapper) return;

    const section = wrapper.closest(
        ".gcsHalamanPromoBannerSection"
    );

    clearInterval(gcsHalamanPromoBannerTimer);
    gcsHalamanPromoBannerTimer = null;

    wrapper.innerHTML = "";

    if (activeBanners.length === 0) {
        wrapper.classList.add(
            "gcsHalamanPromoBannerCollapse"
        );

        if (section) {
            section.hidden = true;
        }

        return;
    }

    wrapper.classList.remove(
        "gcsHalamanPromoBannerCollapse"
    );

    if (section) {
        section.hidden = false;
    }

    const header = document.createElement("div");
    header.className = "gcsHalamanPromoBannerHeader";

    const title = document.createElement("h2");
    title.className = "gcsHalamanPromoBannerTitle";
    title.textContent = "";

    header.appendChild(title);
    wrapper.appendChild(header);

    const slider = document.createElement("div");
    slider.className = "gcsHalamanPromoBannerSlider";

    const track = document.createElement("div");
    track.className = "gcsHalamanPromoBannerTrack";
    track.id = "gcsHalamanPromoBannerTrackEl";

    activeBanners.forEach(banner => {
        const item = document.createElement("div");
        item.className = "gcsHalamanPromoBannerItem";

        const link = document.createElement("a");
        link.className = "gcsHalamanPromoBannerLink";
        link.href = banner.link;

        const image = document.createElement("img");
        image.className = "gcsHalamanPromoBannerImage";
        image.src = banner.image;
        image.alt = "GOCES Promo";
        image.loading = "lazy";

        link.appendChild(image);
        item.appendChild(link);
        track.appendChild(item);
    });

    slider.appendChild(track);
    wrapper.appendChild(slider);

    gcsHalamanPromoBannerCreateDots(
        activeBanners.length,
        wrapper
    );

    if (activeBanners.length > 1) {
        gcsHalamanPromoBannerAutoSlide();
        gcsHalamanPromoBannerSwipe(slider);
    }
}

function gcsHalamanPromoBannerCreateDots(total, parent) {
    const dots = document.createElement("div");
    dots.className = "gcsHalamanPromoBannerDots";
    dots.id = "gcsHalamanPromoBannerDotsContainerEl";

    if (total === 1 || total > 5) {
        dots.classList.add(
            "gcsHalamanPromoBannerHidden"
        );
    }

    for (let index = 0; index < total; index++) {
        const dot = document.createElement("span");
        dot.className = "gcsHalamanPromoBannerDot";

        if (index === 0) {
            dot.classList.add(
                "gcsHalamanPromoBannerActive"
            );
        }

        dots.appendChild(dot);
    }

    parent.appendChild(dots);
}

function gcsHalamanPromoBannerGoToSlide(index) {
    const track = document.getElementById(
        "gcsHalamanPromoBannerTrackEl"
    );

    const dots = document.getElementById(
        "gcsHalamanPromoBannerDotsContainerEl"
    );

    const total = gcsHalamanPromoBannerActiveItems.length;

    if (!track || total === 0) return;

    gcsHalamanPromoBannerCurrentIndex =
        (index + total) % total;

    track.style.transform =
        `translateX(-${gcsHalamanPromoBannerCurrentIndex * 100}%)`;

    if (dots &&
        !dots.classList.contains(
            "gcsHalamanPromoBannerHidden"
        )) {
        dots.querySelectorAll(
            ".gcsHalamanPromoBannerDot"
        ).forEach((dot, dotIndex) => {
            dot.classList.toggle(
                "gcsHalamanPromoBannerActive",
                dotIndex ===
                gcsHalamanPromoBannerCurrentIndex
            );
        });
    }
}

function gcsHalamanPromoBannerAutoSlide() {
    clearInterval(gcsHalamanPromoBannerTimer);

    if (gcsHalamanPromoBannerActiveItems.length <= 1) {
        return;
    }

    gcsHalamanPromoBannerTimer = setInterval(() => {
        gcsHalamanPromoBannerGoToSlide(
            gcsHalamanPromoBannerCurrentIndex + 1
        );
    }, 4000);
}

function gcsHalamanPromoBannerSwipe(slider) {
    slider.addEventListener("touchstart", event => {
        gcsHalamanPromoBannerTouchStartX =
            event.changedTouches[0].screenX;

        clearInterval(gcsHalamanPromoBannerTimer);
    }, { passive: true });

    slider.addEventListener("touchend", event => {
        gcsHalamanPromoBannerTouchEndX =
            event.changedTouches[0].screenX;

        const distance =
            gcsHalamanPromoBannerTouchStartX -
            gcsHalamanPromoBannerTouchEndX;

        if (distance > 45) {
            gcsHalamanPromoBannerGoToSlide(
                gcsHalamanPromoBannerCurrentIndex + 1
            );
        }

        if (distance < -45) {
            gcsHalamanPromoBannerGoToSlide(
                gcsHalamanPromoBannerCurrentIndex - 1
            );
        }

        gcsHalamanPromoBannerAutoSlide();
    }, { passive: true });
}