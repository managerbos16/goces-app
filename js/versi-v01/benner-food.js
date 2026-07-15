const gcsFoodBannerData = [
    {
        image: "https://res.cloudinary.com/dutuhbbg2/image/upload/v1784097737/ChatGPT_Image_15_Jul_2026_14.42.05_c7if8c.png",
        link: "merchant-food-1.html",
        start: "2026-07-01 00:00:00",
        end: "2027-07-31 23:59:59"
    },

];

let gcsFoodBannerCurrentIndex = 0;
let gcsFoodBannerActiveItems = [];
let gcsFoodBannerTimer = null;
let gcsFoodBannerScheduleTimer = null;
let gcsFoodBannerTouchStartX = 0;
let gcsFoodBannerTouchEndX = 0;

document.addEventListener("DOMContentLoaded", () => {
    gcsFoodBannerInit();
});

function gcsFoodBannerInit() {
    gcsFoodBannerRefresh();

    clearInterval(gcsFoodBannerScheduleTimer);

    gcsFoodBannerScheduleTimer = setInterval(() => {
        gcsFoodBannerRefresh();
    }, 60000);
}

function gcsFoodBannerRefresh() {
    gcsFoodBannerActiveItems =
        gcsFoodBannerCheckSchedule(gcsFoodBannerData);

    gcsFoodBannerCurrentIndex = 0;

    gcsFoodBannerRender(gcsFoodBannerActiveItems);
}

function gcsFoodBannerCheckSchedule(bannerList) {
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

function gcsFoodBannerRender(activeBanners) {
    const wrapper = document.getElementById(
        "gcsFoodBannerContainer"
    );

    if (!wrapper) return;

    const section = wrapper.closest(
        ".gcsFoodBannerSection"
    );

    clearInterval(gcsFoodBannerTimer);
    gcsFoodBannerTimer = null;

    wrapper.innerHTML = "";

    if (activeBanners.length === 0) {
        wrapper.classList.add("gcsFoodBannerCollapse");

        if (section) {
            section.hidden = true;
        }

        return;
    }

    wrapper.classList.remove("gcsFoodBannerCollapse");

    if (section) {
        section.hidden = false;
    }

    const header = document.createElement("div");
    header.className = "gcsFoodBannerHeader";

    const title = document.createElement("h2");
    title.className = "gcsFoodBannerTitle";
    title.textContent = "";

    header.appendChild(title);
    wrapper.appendChild(header);

    const slider = document.createElement("div");
    slider.className = "gcsFoodBannerSlider";

    const track = document.createElement("div");
    track.className = "gcsFoodBannerTrack";
    track.id = "gcsFoodBannerTrackEl";

    activeBanners.forEach(banner => {
        const item = document.createElement("div");
        item.className = "gcsFoodBannerItem";

        const link = document.createElement("a");
        link.className = "gcsFoodBannerLink";
        link.href = banner.link;

        const image = document.createElement("img");
        image.className = "gcsFoodBannerImage";
        image.src = banner.image;
        image.alt = "GOCES Food Promo";
        image.loading = "lazy";

        link.appendChild(image);
        item.appendChild(link);
        track.appendChild(item);
    });

    slider.appendChild(track);
    wrapper.appendChild(slider);

    gcsFoodBannerCreateDots(activeBanners.length, wrapper);

    if (activeBanners.length > 1) {
        gcsFoodBannerAutoSlide();
        gcsFoodBannerSwipe(slider);
    }
}

function gcsFoodBannerCreateDots(total, parent) {
    const dots = document.createElement("div");
    dots.className = "gcsFoodBannerDots";
    dots.id = "gcsFoodBannerDotsContainerEl";

    if (total === 1 || total > 5) {
        dots.classList.add("gcsFoodBannerHidden");
    }

    for (let index = 0; index < total; index++) {
        const dot = document.createElement("span");
        dot.className = "gcsFoodBannerDot";

        if (index === 0) {
            dot.classList.add("gcsFoodBannerActive");
        }

        dots.appendChild(dot);
    }

    parent.appendChild(dots);
}

function gcsFoodBannerGoToSlide(index) {
    const track = document.getElementById(
        "gcsFoodBannerTrackEl"
    );

    const dots = document.getElementById(
        "gcsFoodBannerDotsContainerEl"
    );

    const total = gcsFoodBannerActiveItems.length;

    if (!track || total === 0) return;

    gcsFoodBannerCurrentIndex =
        (index + total) % total;

    track.style.transform =
        `translateX(-${gcsFoodBannerCurrentIndex * 100}%)`;

    if (dots &&
        !dots.classList.contains("gcsFoodBannerHidden")) {
        dots.querySelectorAll(".gcsFoodBannerDot")
            .forEach((dot, dotIndex) => {
                dot.classList.toggle(
                    "gcsFoodBannerActive",
                    dotIndex === gcsFoodBannerCurrentIndex
                );
            });
    }
}

function gcsFoodBannerAutoSlide() {
    clearInterval(gcsFoodBannerTimer);

    if (gcsFoodBannerActiveItems.length <= 1) return;

    gcsFoodBannerTimer = setInterval(() => {
        gcsFoodBannerGoToSlide(
            gcsFoodBannerCurrentIndex + 1
        );
    }, 4000);
}

function gcsFoodBannerSwipe(slider) {
    slider.addEventListener("touchstart", event => {
        gcsFoodBannerTouchStartX =
            event.changedTouches[0].screenX;

        clearInterval(gcsFoodBannerTimer);
    }, { passive: true });

    slider.addEventListener("touchend", event => {
        gcsFoodBannerTouchEndX =
            event.changedTouches[0].screenX;

        const distance =
            gcsFoodBannerTouchStartX -
            gcsFoodBannerTouchEndX;

        if (distance > 45) {
            gcsFoodBannerGoToSlide(
                gcsFoodBannerCurrentIndex + 1
            );
        }

        if (distance < -45) {
            gcsFoodBannerGoToSlide(
                gcsFoodBannerCurrentIndex - 1
            );
        }

        gcsFoodBannerAutoSlide();
    }, { passive: true });
}