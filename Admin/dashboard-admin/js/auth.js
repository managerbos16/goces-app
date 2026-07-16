function showLoginPage() {
    document.getElementById("login-view").style.display = "flex";
    document.getElementById("register-view").style.display = "none";
}

function showRegisterPage() {
    document.getElementById("login-view").style.display = "none";
    document.getElementById("register-view").style.display = "flex";
}

function triggerSecureLogout() {
    clearTimeout(sessionTimer);
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    document.getElementById("app-view").style.display = "none";
    document.getElementById("register-view").style.display = "none";
    document.getElementById("login-view").style.display = "flex";
}

async function handleSecureLogin(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorAlert = document.getElementById("login-error");

    errorAlert.style.display = "none";

    try {

        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        // Ambil data JSON sekali saja
        const data = await response.json();
        console.log("LOGIN RESPONSE:", data);

        // Kalau server mengembalikan status error
        if (!response.ok) {

            errorAlert.innerText =
                data.message || "Terjadi kesalahan pada server.";

            errorAlert.style.display = "block";

            return;

        }

        // Kalau login gagal
        if (!data.success) {

            errorAlert.innerText =
                data.message || "Login gagal.";

            errorAlert.style.display = "block";

            return;

        }

        // Pastikan token ada
        if (!data.token) {

            errorAlert.innerText =
                "Server tidak mengirim token login.";

            errorAlert.style.display = "block";

            return;

        }

        // Simpan token
        // Simpan token
        localStorage.setItem("token", data.token);

        // Simpan data admin di LocalStorage
        localStorage.setItem(
            "admin",
            JSON.stringify(data.admin)
        );

        // (Opsional) tetap simpan di SessionStorage jika dipakai fitur lain
        sessionStorage.setItem(
            "authenticated_user",
            JSON.stringify(data.admin)
        );

        // Masuk dashboard
        bootSystemEngine();

    } catch (err) {

        console.error(err);

        errorAlert.innerText =
            "Tidak dapat terhubung ke server.";

        errorAlert.style.display = "block";

    }

}

async function handleRegister(e) {

    e.preventDefault();

    const full_name = document.getElementById("register-full-name").value.trim();

    const email = document.getElementById("register-email").value.trim();

    const phone = document.getElementById("register-phone").value.trim();

    const password = document.getElementById("register-password").value;

    const confirmPassword =
        document.getElementById("register-confirm-password").value;

    const errorBox =
        document.getElementById("register-error");

    errorBox.style.display = "none";

    // Validasi Password
    if (password !== confirmPassword) {

        errorBox.innerText =
            "Konfirmasi password tidak sama.";

        errorBox.style.display = "block";

        return;

    }

    if (password.length < 6) {

        errorBox.innerText =
            "Password minimal 6 karakter.";

        errorBox.style.display = "block";

        return;

    }

    try {

        const response = await fetch(

            "http://localhost:3000/api/register-admin",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    full_name,

                    email,

                    phone,

                    password

                })

            }

        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            errorBox.innerText =
                data.message;

            errorBox.style.display = "block";

            return;

        }

        showNotification(

            "Pendaftaran berhasil. Menunggu persetujuan Super Admin."

        );

        // Reset Form
        document.getElementById("register-form").reset();

        // Kembali ke Login
        showLoginPage();

    } catch (err) {

        console.log(err);

        errorBox.innerText =
            "Tidak dapat terhubung ke server.";

        errorBox.style.display = "block";

    }

}

