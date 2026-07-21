/*==================================================
                GOCES ROUTER v3.0 (Scoped)
==================================================*/
(function () {
    // Sekarang variabel ini aman di dalam scope internal router
    let currentPage = "home";
    let pageHistory = [];

    /*==================================================
                    CACHE
    ==================================================*/
    const pages = {};
    const navs = {};

    /*==================================================
                    INITIALIZE
    ==================================================*/
    document.addEventListener("DOMContentLoaded", initRouter);

    function initRouter() {
        document.querySelectorAll(".goces-page").forEach(page => {
            pages[page.id.replace("page-", "")] = page;
        });

        document.querySelectorAll(".goces-nav-item").forEach(nav => {
            navs[nav.dataset.page] = nav;
        });

        history.replaceState(
            { page: currentPage },
            "",
            "#" + currentPage
        );
    }

    /*==================================================
                    UPDATE PAGE
    ==================================================*/
    function updatePage(page) {
        if (!pages[page]) {
            console.warn("Page tidak ditemukan :", page);
            return false;
        }

        Object.values(pages).forEach(item => {
            item.classList.remove("goces-active");
        });
        pages[page].classList.add("goces-active");

        Object.values(navs).forEach(item => {
            item.classList.remove("goces-active");
        });

        if (navs[page]) {
            navs[page].classList.add("goces-active");
        }

        window.scrollTo(0, 0);
        currentPage = page;
        return true;
    }

    /*==================================================
                    SHOW PAGE
    ==================================================*/
    function showPage(page) {
        if (!page) return;
        if (page === currentPage) return;
        if (!pages[page]) return;

        const last = pageHistory[pageHistory.length - 1];
        if (last !== currentPage) {
            pageHistory.push(currentPage);
        }

        history.pushState(
            { page: page },
            "",
            "#" + page
        );

        updatePage(page);
    }

    /*==================================================
                    REPLACE PAGE
    ==================================================*/
    function replacePage(page) {
        if (!page) return;
        if (!pages[page]) return;

        history.replaceState(
            { page: page },
            "",
            "#" + page
        );

        updatePage(page);
    }

    /*==================================================
                    GO BACK
    ==================================================*/
    function goBack() {
        if (pageHistory.length > 0) {
            history.back();
            return;
        }
        window.location.href = "action://act/back";
    }

    /*==================================================
                ANDROID / BROWSER BACK
    ==================================================*/
    window.addEventListener("popstate", function () {
        if (pageHistory.length === 0) {
            currentPage = "home";
            return;
        }
        const previous = pageHistory.pop();
        updatePage(previous);
    });

    /*==================================================
                    RESET HISTORY
    ==================================================*/
    function resetHistory() {
        pageHistory = [];
    }

    /*==================================================
                    GET CURRENT PAGE
    ==================================================*/
    function getCurrentPage() {
        return currentPage;
    }

    /*==================================================
                    GET PREVIOUS PAGE
    ==================================================*/
    function getPreviousPage() {
        if (pageHistory.length === 0) {
            return null;
        }
        return pageHistory[pageHistory.length - 1];
    }

    /*==================================================
                    CAN GO BACK
    ==================================================*/
    function canGoBack() {
        return pageHistory.length > 0;
    }

    // ==================================================
    // EKSPOR FUNGSI KE GLOBAL WINDOW AGAR BISA DIAKSES HTML & APP.JS
    // ==================================================
    window.showPage = showPage;
    window.replacePage = replacePage;
    window.goBack = goBack;
    window.resetHistory = resetHistory;
    window.getCurrentPage = getCurrentPage;
    window.getPreviousPage = getPreviousPage;
    window.canGoBack = canGoBack;

})();