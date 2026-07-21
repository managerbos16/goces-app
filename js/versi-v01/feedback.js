/*==================================================
        GOCES FEEDBACK ENGINE v3.0 FINAL (Fixed)
==================================================*/

const GocesFeedback = (() => {

    /*==================================
                CONFIG
    ==================================*/

    const CONFIG = {

        vibration: true,

        vibrationTime: 10,

        sound: true,

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

        audio = new Audio(CONFIG.soundFile);

        audio.preload = "auto";

        audio.volume = CONFIG.volume;

        // DIUBAH: Hapus audio.load() langsung di sini agar tidak diintervensi browser saat awal load
    }

    /*==================================
            HAPTIC FEEDBACK
    ==================================*/

    function vibrate() {

        if (!CONFIG.vibration) return;

        if (!navigator.vibrate) return;

        // DIUBAH: Bungkus try-catch agar kegagalan getar di browser tertentu tidak menghentikan fungsi lain
        try {
            navigator.vibrate(CONFIG.vibrationTime);
        } catch (e) {
            console.warn("Vibration blocked or not supported:", e);
        }

    }

    /*==================================
                SOUND
    ==================================*/

    function playSound() {

        // DIUBAH: Inisialisasi audio secara dinamis di sini jika belum ada
        if (!audio) {
            initSound();
        }

        if (!audio) return;

        try {

            audio.pause();

            audio.currentTime = 0;

            audio.play().catch((err) => {
                console.log("Audio play delayed until user gesture:", err);
            });

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

                    {
                        transform: "scale(1)"
                    },

                    {
                        transform: "scale(.95)"
                    },

                    {
                        transform: "scale(1)"
                    }

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

        // DIUBAH: Hapus initSound() dari awal load halaman

        document.addEventListener(

            "pointerdown",

            function (e) {

                const target = e.target.closest(

                    "button,a,[data-feedback],.goces-click"

                );

                if (!target) return;

                play(target);

            },

            { passive: true }

        );

        document.addEventListener("visibilitychange", function () {

            if (!document.hidden && audio) {

                try {
                    audio.load();
                } catch (e) { }

            }

        });

    }

    /*==================================
                API
    ==================================*/

    return {

        enableAuto,

        play

    };

})();