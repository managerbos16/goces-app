/*==================================================
        GOCES DEVELOPMENT NOTICE
==================================================*/

function showDevelopmentNotice() {

    const old = document.getElementById("goces-dev-popup");

    if (old) old.remove();

    const popup = document.createElement("div");

    popup.id = "goces-dev-popup";

    popup.innerHTML = `
        <div class="goces-dev-overlay"></div>

        <div class="goces-dev-box">

            <div class="goces-dev-icon">🚧</div>

            <h3>Fitur Masih Dalam Pengembangan</h3>

            <p>
                Maaf, fitur ini masih dalam tahap pengembangan.
                Silakan tunggu pembaruan GOCES berikutnya.
            </p>

            <button class="goces-dev-button">
                Mengerti
            </button>

        </div>
    `;

    document.body.appendChild(popup);

    popup
        .querySelector(".goces-dev-button")
        .onclick = () => popup.remove();

    popup
        .querySelector(".goces-dev-overlay")
        .onclick = () => popup.remove();

}