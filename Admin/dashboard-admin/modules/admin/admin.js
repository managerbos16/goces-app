function loadAdmin() {

    // Inisialisasi modul admin jika diperlukan

}

async function renderRbacWorkspace(container) {

    const html = await fetch(
        "modules/admin/admin.html"
    ).then(res => res.text());

    container.innerHTML = html;

    buildRbacRoleSelector();

    switchAdminTab("active");

}

function openAdminRegisterModal() {

    document.getElementById("admin-register-modal").style.display = "flex";

    // Bersihkan form
    document.getElementById("new-admin-name").value = "";
    document.getElementById("new-admin-email").value = "";
    document.getElementById("new-admin-phone").value = "";
    document.getElementById("new-admin-password").value = "";
    document.getElementById("new-admin-confirm").value = "";

}

function closeAdminRegisterModal() {

    document.getElementById("admin-register-modal").style.display = "none";

}

function switchAdminTab(tab) {

    document
        .getElementById("tab-active")
        .classList.remove("active");

    document
        .getElementById("tab-pending")
        .classList.remove("active");

    if (tab === "active") {

        document
            .getElementById("tab-active")
            .classList.add("active");

        document.getElementById("admin-table-head").innerHTML = `
                <thead>
<tr>

    <th>Nama Akun</th>

    <th>Email</th>

    <th>No HP</th>

    <th>Role</th>

    <th>Status</th>

    <th style="width:120px;">Aksi</th>

</tr>
</thead>
`;

        buildRbacAdminTable();

    }



    else {

        document
            .getElementById("tab-pending")
            .classList.add("active");

        document.getElementById("admin-table-head").innerHTML = `
<tr>

<th>Nama Akun</th>

<th>Email</th>

<th>No HP</th>

<th>Status</th>

<th style="width:180px;">Aksi</th>

</tr>
`;

        buildPendingAdminTable();

    }

}

async function buildPendingAdminTable() {

    const token = localStorage.getItem("token");

    const tbody = document.getElementById("admin-list-target");

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:30px;">
                Memuat data...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(

            "http://localhost:3000/api/pending-admins",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center;color:red;padding:25px;">
                        ${data.message || "Gagal mengambil data."}
                    </td>
                </tr>
            `;

            return;

        }

        if (data.admins.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center;padding:25px;">
                        Tidak ada permintaan admin.
                    </td>
                </tr>
            `;

            return;

        }

        window.pendingAdmins = data.admins;

        let html = "";

        data.admins.forEach(admin => {

            html += `

<tr>

    <td style="font-weight:600;">

        ${admin.full_name}

    </td>

    <td>

        ${admin.email}

    </td>

    <td>

        ${admin.phone}

    </td>

    <td>

        <span class="badge warning">

            Pending

        </span>

    </td>

    

    <td>

        <button
            class="btn-action btn-sm-success"
            onclick="approveAdmin(${admin.id})">

            Approve

        </button>

        <button
            class="btn-action btn-sm-danger"
            onclick="confirmRejectAdmin(${admin.id},'${admin.full_name}')">

            Reject

        </button>

    </td>

</tr>

`;

        });

        tbody.innerHTML = html;

    }

    catch (err) {

        console.log(err);

        tbody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;color:red;padding:25px;">
                    Tidak dapat terhubung ke server.
                </td>
            </tr>
        `;

    }

}

// =====================================
// APPROVE ADMIN
// =====================================
let selectedApproveId = null;

async function approveAdmin(id) {

    selectedApproveId = id;

    const admin = window.pendingAdmins.find(a => a.id === id);

    document.getElementById("approve-name").value =
        admin.full_name;

    document.getElementById("approve-email").value =
        admin.email;

    const select =
        document.getElementById("approve-role");

    select.innerHTML = "";

    const res = await fetch(
        "http://localhost:3000/api/roles"
    );

    const data = await res.json();

    data.roles.forEach(role => {

        select.innerHTML += `
            <option value="${role.id}">
                ${role.role_name}
            </option>
        `;

    });

    document.getElementById("approve-modal").style.display = "flex";

}

async function submitApproveAdmin() {

    try {

        const token = localStorage.getItem("token");

        const role_id =
            document.getElementById("approve-role").value;

        const response = await fetch(

            `http://localhost:3000/api/admins/approve/${selectedApproveId}`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    role_id

                })

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            showNotification(

                data.message,

                "error"

            );

            return;

        }

        showNotification(

            "Admin berhasil diaktifkan.",

            "success"

        );

        closeApproveModal();

        // Refresh tabel
        buildPendingAdminTable();

        buildRbacAdminTable();

    }

    catch (err) {

        console.log(err);

        showNotification(

            "Tidak dapat terhubung ke server.",

            "error"

        );

    }

}

async function processRejectAdmin() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:3000/api/admins/reject/${rejectAdminId}`,

            {

                method: "PATCH",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            showNotification(data.message);

            return;

        }

        closeRejectModal();

        showNotification("Admin berhasil ditolak.");

        buildPendingAdminTable();

        buildRbacAdminTable();

    }

    catch (err) {

        console.log(err);

        showNotification("Server tidak dapat dihubungi.");

    }

}

function closeApproveModal() {

    selectedApproveId = null;

    document
        .getElementById("approve-modal")
        .style.display = "none";

}

function closeRejectModal() {

    rejectAdminId = null;

    document.getElementById("reject-admin-modal").style.display = "none";

}

async function buildRbacRoleSelector() {

    const container = document.getElementById("role-list-target");

    container.innerHTML = "Memuat role...";

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/api/roles",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            container.innerHTML = "Gagal memuat role.";

            return;

        }

        window.rolesData = data.roles;

        if (!window.selectedRoleId) {

            window.selectedRoleId = data.roles[0].id;

        }

        let html = "";

        data.roles.forEach(role => {

            const active =
                role.id === window.selectedRoleId
                    ? "active"
                    : "";

            html += `

<div
    class="role-option ${active}"
    onclick="selectRbacRole(${role.id},'${role.role_name}')">

    <i class="fa-solid fa-shield-halved"></i>

    ${role.role_name}

</div>

`;

        });

        container.innerHTML = html;

        const currentRole =
            data.roles.find(r => r.id === window.selectedRoleId);

        document.getElementById("matrix-role-title").innerText =
            currentRole.role_name;

        loadPermissionMatrix(window.selectedRoleId);

    }

    catch (err) {

        console.log(err);

        container.innerHTML = "Server tidak dapat dihubungi.";

    }

}

async function saveRbacMatrixConfig() {

    if (!window.selectedRoleId) {

        showNotification("Role belum dipilih.");

        return;

    }

    const checkboxes =
        document.querySelectorAll(".rbac-matrix-checkbox");

    const permissions = {

        dashboard: false,
        pembayaran: false,
        withdraw: false,
        voucher: false,
        banner: false,
        pengaturan: false,
        admin: false

    };

    checkboxes.forEach(cb => {

        permissions[cb.value] = cb.checked;

    });

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:3000/api/permissions/${window.selectedRoleId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify(permissions)

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            showNotification(

                data.message || "Gagal menyimpan hak akses."

            );

            return;

        }

        showNotification(

            "Hak akses berhasil diperbarui."

        );

    }

    catch (err) {

        console.log(err);

        showNotification(

            "Server tidak dapat dihubungi."

        );

    }

}

async function buildRbacAdminTable() {

    const token = localStorage.getItem("token");

    const container =
        document.getElementById("admin-list-target");

    try {

        const response = await fetch(
            "http://localhost:3000/api/admins",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {

            triggerSecureLogout();

            return;

        }

        const data = await response.json();

        if (!response.ok || !data.success) {

            container.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;padding:30px;color:red;">
                        ${data.message || "Gagal mengambil data admin."}
                    </td>
                </tr>
            `;

            return;

        }

        if (!data.admins || data.admins.length === 0) {

            container.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;padding:30px;">
                        Belum ada data admin.
                    </td>
                </tr>
            `;

            return;

        }

        let html = "";

        data.admins.forEach(admin => {

            html += `

<tr>

    <td style="font-weight:600;">
        ${admin.full_name}
    </td>

    <td>
        ${admin.email}
    </td>

    <td>
        ${admin.phone || "-"}
    </td>

    <td>
        ${admin.role_name || "-"}
    </td>

    <td>
        <span class="badge ${admin.status === "Aktif" ? "success" : "danger"}">
            ${admin.status}
        </span>
    </td>

    <td>

        <button
            class="btn-action btn-sm-primary"
            onclick="openManageAdmin(${admin.id})">

            <i class="fa-solid fa-gear"></i>

            Kelola

        </button>

    </td>

</tr>

`;

        });

        container.innerHTML = html;

    }

    catch (err) {

        console.error(err);

        container.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center;padding:30px;color:red;">
                    Tidak dapat terhubung ke server.
                </td>
            </tr>
        `;

    }

}

let selectedManageAdmin = null;

function closeManageAdmin() {

    document
        .getElementById("manage-admin-modal")
        .style.display = "none";

}

async function saveManageAdmin() {

    try {

        const token = localStorage.getItem("token");

        const id = document.getElementById("manage-admin-id").value;

        const role_id = document.getElementById("manage-admin-role").value;

        const status = document.getElementById("manage-admin-status").value;

        const response = await fetch(

            `http://localhost:3000/api/admins/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    role_id,

                    status

                })

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            showNotification(data.message);

            return;

        }

        showNotification("Data admin berhasil diperbarui.");

        closeManageAdmin();

        buildRbacAdminTable();

    }

    catch (err) {

        console.log(err);

        showNotification("Server tidak dapat dihubungi.");

    }

}

function openResetPasswordModal() {

    document.getElementById("reset-password").value = "";

    document.getElementById("reset-confirm-password").value = "";

    document.getElementById("reset-password-modal").style.display = "flex";

}

function closeResetPasswordModal() {

    document.getElementById("reset-password-modal").style.display = "none";

}

async function resetAdminPassword() {

    const password =
        document.getElementById("reset-password").value;

    const confirm =
        document.getElementById("reset-confirm-password").value;

    if (password === "") {

        showNotification("Password baru wajib diisi.");

        return;

    }

    if (password !== confirm) {

        showNotification("Konfirmasi password tidak sama.");

        return;

    }

    try {

        const token = localStorage.getItem("token");

        const id =
            document.getElementById("manage-admin-id").value;

        const response = await fetch(

            `http://localhost:3000/api/admins/reset-password/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    password

                })

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            showNotification(data.message);

            return;

        }

        closeResetPasswordModal();

        showNotification("Password berhasil direset.");

    }

    catch (err) {

        console.log(err);

        showNotification("Server tidak dapat dihubungi.");

    }

}

let rejectAdminId = null;

function confirmRejectAdmin(id, name) {

    rejectAdminId = id;

    document.getElementById("reject-admin-name").innerText = name;

    document.getElementById("reject-admin-modal").style.display = "flex";

}

// =====================================
// LOAD PERMISSION MATRIX
// =====================================

async function loadPermissionMatrix(roleId) {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:3000/api/permissions/${roleId}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        const container =
            document.getElementById("menu-matrix-target");

        if (!response.ok || !data.success) {

            container.innerHTML = `
                <div style="padding:15px;color:red;">
                    Gagal memuat hak akses.
                </div>
            `;

            return;

        }

        const permissions = data.permissions || {};

        const menus = [

            { key: "dashboard", label: "Dashboard" },
            { key: "merchant", label: "Merchant" },
            { key: "pembayaran", label: "Pembayaran" },
            { key: "withdraw", label: "Withdrawal" },
            { key: "voucher", label: "Voucher Promo" },
            { key: "banner", label: "Banner Promosi" },
            { key: "pengaturan", label: "Pengaturan Sistem" },
            { key: "admin", label: "Hak Akses & Admin" }

        ];

        let html = "";

        menus.forEach(menu => {

            html += `

<label
    style="display:flex;align-items:center;gap:10px;margin-bottom:12px;cursor:pointer;">

    <input
        type="checkbox"
        class="rbac-matrix-checkbox"
        value="${menu.key}"
        ${permissions[menu.key] ? "checked" : ""}>

    ${menu.label}

</label>

`;

        });

        container.innerHTML = html;

    }

    catch (err) {

        console.error(err);

        document.getElementById("menu-matrix-target").innerHTML = `
            <div style="padding:15px;color:red;">
                Server tidak dapat dihubungi.
            </div>
        `;

    }

}

// =====================================
// OPEN MANAGE ADMIN
// =====================================

async function openManageAdmin(id) {

    try {

        selectedManageAdmin = id;

        const token = localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:3000/api/admins/${id}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            showNotification(

                data.message || "Gagal mengambil data admin."

            );

            return;

        }

        const admin = data.admin;

        document.getElementById("manage-admin-id").value =
            admin.id;

        document.getElementById("manage-admin-name").value =
            admin.full_name;

        document.getElementById("manage-admin-email").value =
            admin.email;



        // Load daftar role

        const roleResponse = await fetch(

            "http://localhost:3000/api/roles",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const roleData = await roleResponse.json();

        const roleSelect =
            document.getElementById("manage-admin-role");

        roleSelect.innerHTML = "";

        roleData.roles.forEach(role => {

            roleSelect.innerHTML += `

<option
    value="${role.id}"
    ${role.id === admin.role_id ? "selected" : ""}>

    ${role.role_name}

</option>

`;

        });

        document.getElementById("manage-admin-status").value =
            admin.status;

        document.getElementById("manage-admin-modal").style.display =
            "flex";

    }

    catch (err) {

        console.error(err);

        showNotification(

            "Server tidak dapat dihubungi."

        );

    }

}

// =====================================
// SELECT ROLE
// =====================================

function selectRbacRole(roleId, roleName) {

    window.selectedRoleId = roleId;

    document.getElementById("matrix-role-title").innerText = roleName;

    document.querySelectorAll(".role-option").forEach(item => {
        item.classList.remove("active");
    });

    document.querySelectorAll(".role-option").forEach(item => {

        if (item.getAttribute("onclick") === `selectRbacRole(${roleId},'${roleName}')`) {

            item.classList.add("active");

        }

    });

    loadPermissionMatrix(roleId);

}

