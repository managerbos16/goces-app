/*==================================================
        GOCES FEEDBACK ENGINE v3.0 FINAL (Safe Localhost)
==================================================*/

const GocesFeedback = (() => {

    /*==================================
                CONFIG
    ==================================*/

    const CONFIG = {

        // Otomatis matikan getar & suara jika dijalankan di localhost/127.0.0.1 agar tidak diblokir browser laptop
        vibration: !["localhost", "127.0.0.1"].includes(window.location.hostname),

        vibrationTime: 10,

        sound: !["localhost", "127.0.0.1"].includes(window.location.hostname),

        volume: 0.35,

        soundFile: "https://goces-app.vercel.app/assets/audio/click.wav",

        animationDuration: 120

    };

    /*==================================
                AUDIO
    ==================================*/

    let audio = null;

    function initSound() {

        if (!CONFIG.sound) return;

        if (audio) return;

        try {
            audio = new Audio(CONFIG.soundFile);
            audio.preload = "auto";
            audio.volume = CONFIG.volume;
        } catch (e) { }

    }

    /*==================================
            HAPTIC FEEDBACK
    ==================================*/

    function vibrate() {

        if (!CONFIG.vibration) return;

        if (!navigator.vibrate) return;

        try {
            navigator.vibrate(CONFIG.vibrationTime);
        } catch (e) { }

    }

    /*==================================
                SOUND
    ==================================*/

    function playSound() {

        if (!CONFIG.sound) return;

        if (!audio) {
            initSound();
        }

        if (!audio) return;

        try {

            audio.pause();

            audio.currentTime = 0;

            audio.play().catch(() => { });

        } catch (e) { }

    }

    /*==================================
            SCALE EFFECT
    ==================================*/

    function animate(element) {

        if (!element) return;

        if (element.animate) {

            element.getAnimations().forEach(anim => anim.cancel());

            element.animate(

                [

                    { transform: "scale(1)" },

                    { transform: "scale(.95)" },

                    { transform: "scale(1)" }

                ],

                {

                    duration: CONFIG.animationDuration,

                    easing: "ease-out"

                }

            );

        }

    }

    /*==================================
                PLAY
    ==================================*/

    function play(element = null) {

        vibrate();

        playSound();

        animate(element);

    }

    /*==================================
            AUTO ENABLE
    ==================================*/

    function enableAuto() {

        // UBAH: Menggunakan 'click' bukan 'pointerdown' agar gesture user tercatat valid oleh browser
        document.addEventListener(

            "click",

            function (e) {

                const target = e.target.closest(

                    "button,a,[data-feedback],.goces-click"

                );

                if (!target) return;

                play(target);

            }

        );

    }

    /*==================================
                API
    ==================================*/

    return {

        enableAuto,

        play

    };

})();