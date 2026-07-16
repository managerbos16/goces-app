// =====================================
// GOCES SESSION MANAGER
// =====================================

// Session akan berakhir setelah 10 menit
const SESSION_TIMEOUT = 10 * 60 * 1000;

// Penampung timer
let sessionTimer = null;

// =====================================
// START SESSION
// =====================================

function startSessionTimeout() {

    clearTimeout(sessionTimer);

    sessionTimer = setTimeout(() => {

        alert("Session berakhir. Silakan login kembali.");

        triggerSecureLogout();

    }, SESSION_TIMEOUT);

}

// =====================================
// RESET SESSION
// =====================================

function resetSessionTimeout() {

    startSessionTimeout();

}