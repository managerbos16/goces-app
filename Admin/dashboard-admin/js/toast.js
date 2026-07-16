// =====================================
// GOCES TOAST NOTIFICATION
// =====================================

function showNotification(message, duration = 3500) {

    const toast = document.getElementById("toast");

    if (!toast) {

        console.error("Toast element tidak ditemukan.");

        return;

    }

    toast.innerText = message;

    toast.style.display = "block";

    clearTimeout(toast.timeout);

    toast.timeout = setTimeout(() => {

        toast.style.display = "none";

    }, duration);

}