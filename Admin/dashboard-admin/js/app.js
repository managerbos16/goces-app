const SystemStorage = {
    admins: [],
    activeRoleSelection: null
};

function bootSystemEngine() {
    const userData = localStorage.getItem("admin");
    if (!userData) {
        triggerSecureLogout();
        return;
    }

    const user = JSON.parse(userData);
    document.getElementById("login-view").style.display = "none";
    document.getElementById("register-view").style.display = "none";
    document.getElementById("app-view").style.display = "flex";
    document.getElementById("session-user-name").innerText =
        user.full_name;
    document.getElementById("session-user-role").innerText =
        user.role_name;

    buildDynamicSidebar();
    startSessionTimeout();
}

if (localStorage.getItem("admin")) {
    bootSystemEngine();
}

document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("click", resetSessionTimeout);
document.addEventListener("keydown", resetSessionTimeout);
document.addEventListener("scroll", resetSessionTimeout);
document.addEventListener("touchstart", resetSessionTimeout);