// =====================================
// GOCES MODULE LOADER
// =====================================

async function loadModule(moduleName) {

    const workspace =
        document.getElementById("workspace-view");

    if (!workspace) {

        console.error("Workspace tidak ditemukan.");

        return false;

    }

    try {

        const response = await fetch(

            `modules/${moduleName}/${moduleName}.html`

        );

        if (!response.ok) {

            throw new Error(

                `Module "${moduleName}" tidak ditemukan.`

            );

        }

        const html =
            await response.text();

        workspace.innerHTML = html;

        return true;

    } catch (err) {

        console.error(err);

        workspace.innerHTML = `

            <div
                style="
                    padding:40px;
                    text-align:center;
                    color:#e74c3c;
                ">

                <h2>Gagal Memuat Module</h2>

                <p>${err.message}</p>

            </div>

        `;

        return false;

    }

}