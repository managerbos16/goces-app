/*==================================
      APP HEIGHT FIX
==================================*/

(function () {

  function setAppHeight() {

    document.documentElement.style.setProperty(
      "--app-height",
      window.innerHeight + "px"
    );

  }

  setAppHeight();

  window.addEventListener("orientationchange", () => {

    setTimeout(setAppHeight, 300);

  });

})();

document.addEventListener("DOMContentLoaded", () => {

  replacePage("home");

});