const gcsPromoBannerData = [
    {
        image: "https://res.cloudinary.com/dutuhbbg2/image/upload/v1782284731/ChatGPT_Image_24_Jun_2026_15.05.10_qvp4cm.png",
        link: "https://jgjk.mobi/m/423311195266a570da62f20f1.00665946",
        start: "2026-07-01 00:00:00",
        end: "2027-05-31 23:59:59"
    },
    {
        image: "https://res.cloudinary.com/dutuhbbg2/image/upload/v1781341610/ChatGPT_Image_13_Jun_2026_17.06.23_ykgu3b.png",
        link: "https://jgjk.mobi/m/065911195266a57139a54caf9.11693405",
        start: "2026-07-05 00:00:00",
        end: "2027-07-25 23:59:59"
    }

];

let gcsPromoBannerCurrentIndex = 0;
let gcsPromoBannerActiveItems = [];
let gcsPromoBannerTimer = null;
let gcsPromoBannerScheduleTimer = null;
let gcsPromoBannerTouchStartX = 0;
let gcsPromoBannerTouchEndX = 0;

document.addEventListener("DOMContentLoaded", () => {
    gcsPromoBannerInit();
});

function gcsPromoBannerInit() {
    gcsPromoBannerRefresh();

    clearInterval(gcsPromoBannerScheduleTimer);

    gcsPromoBannerScheduleTimer = setInterval(() => {
        gcsPromoBannerRefresh();
    }, 60000);
}

function gcsPromoBannerRefresh() {
    gcsPromoBannerActiveItems =
        gcsPromoBannerCheckSchedule(gcsPromoBannerData);

    gcsPromoBannerCurrentIndex = 0;

    gcsPromoBannerRender(gcsPromoBannerActiveItems);
}

function gcsPromoBannerCheckSchedule(bannerList) {
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

function gcsPromoBannerRender(activeBanners) {
    const wrapper = document.getElementById(
        "gcsPromoBannerContainer"
    );

    if (!wrapper) return;

    const section = wrapper.closest(
        ".gcsPromoBannerSection"
    );

    clearInterval(gcsPromoBannerTimer);
    gcsPromoBannerTimer = null;

    wrapper.innerHTML = "";

    if (activeBanners.length === 0) {
        wrapper.classList.add("gcsPromoBannerCollapse");

        if (section) {
            section.hidden = true;
        }

        return;
    }

    wrapper.classList.remove("gcsPromoBannerCollapse");

    if (section) {
        section.hidden = false;
    }

    const header = document.createElement("div");
    header.className = "gcsPromoBannerHeader";

    const title = document.createElement("h2");
    title.className = "gcsPromoBannerTitle";
    title.textContent = "Promo Menarik";

    header.appendChild(title);
    wrapper.appendChild(header);

    const slider = document.createElement("div");
    slider.className = "gcsPromoBannerSlider";

    const track = document.createElement("div");
    track.className = "gcsPromoBannerTrack";
    track.id = "gcsPromoBannerTrackEl";

    activeBanners.forEach(banner => {
        const item = document.createElement("div");
        item.className = "gcsPromoBannerItem";

        const link = document.createElement("a");
        link.className = "gcsPromoBannerLink";
        link.href = banner.link;

        const image = document.createElement("img");
        image.className = "gcsPromoBannerImage";
        image.src = banner.image;
        image.alt = "GOCES Promo Banner";
        image.loading = "lazy";

        link.appendChild(image);
        item.appendChild(link);
        track.appendChild(item);
    });

    slider.appendChild(track);
    wrapper.appendChild(slider);

    gcsPromoBannerCreateDots(activeBanners.length, wrapper);

    if (activeBanners.length > 1) {
        gcsPromoBannerAutoSlide();
        gcsPromoBannerSwipe(slider);
    }
}

function gcsPromoBannerCreateDots(total, parent) {
    const dots = document.createElement("div");
    dots.className = "gcsPromoBannerDots";
    dots.id = "gcsPromoBannerDotsContainerEl";

    if (total === 1 || total > 5) {
        dots.classList.add("gcsPromoBannerHidden");
    }

    for (let index = 0; index < total; index++) {
        const dot = document.createElement("span");
        dot.className = "gcsPromoBannerDot";

        if (index === 0) {
            dot.classList.add(
                "gcsPromoPromoBannerActive"
            );
        }

        dots.appendChild(dot);
    }

    parent.appendChild(dots);
}

function gcsPromoBannerGoToSlide(index) {
    const track = document.getElementById(
        "gcsPromoBannerTrackEl"
    );

    const dots = document.getElementById(
        "gcsPromoBannerDotsContainerEl"
    );

    const total = gcsPromoBannerActiveItems.length;

    if (!track || total === 0) return;

    gcsPromoBannerCurrentIndex =
        (index + total) % total;

    track.style.transform =
        `translateX(-${gcsPromoBannerCurrentIndex * 100}%)`;

    if (dots &&
        !dots.classList.contains("gcsPromoBannerHidden")) {
        dots.querySelectorAll(".gcsPromoBannerDot")
            .forEach((dot, dotIndex) => {
                dot.classList.toggle(
                    "gcsPromoPromoBannerActive",
                    dotIndex === gcsPromoBannerCurrentIndex
                );
            });
    }
}

function gcsPromoBannerAutoSlide() {
    clearInterval(gcsPromoBannerTimer);

    if (gcsPromoBannerActiveItems.length <= 1) return;

    gcsPromoBannerTimer = setInterval(() => {
        gcsPromoBannerGoToSlide(
            gcsPromoBannerCurrentIndex + 1
        );
    }, 4000);
}

function gcsPromoBannerSwipe(slider) {
    slider.addEventListener("touchstart", event => {
        gcsPromoBannerTouchStartX =
            event.changedTouches[0].screenX;

        clearInterval(gcsPromoBannerTimer);
    }, { passive: true });

    slider.addEventListener("touchend", event => {
        gcsPromoBannerTouchEndX =
            event.changedTouches[0].screenX;

        const distance =
            gcsPromoBannerTouchStartX -
            gcsPromoBannerTouchEndX;

        if (distance > 45) {
            gcsPromoBannerGoToSlide(
                gcsPromoBannerCurrentIndex + 1
            );
        }

        if (distance < -45) {
            gcsPromoBannerGoToSlide(
                gcsPromoBannerCurrentIndex - 1
            );
        }

        gcsPromoBannerAutoSlide();
    }, { passive: true });
}