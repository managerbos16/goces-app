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

  window.addEventListener("orientationchange", function () {

    setTimeout(setAppHeight, 300);

  });

})();

/*==================================
      APP START
==================================*/

document.addEventListener("DOMContentLoaded", function () {

  if (typeof replacePage === "function") {

    replacePage("home");

  }

});