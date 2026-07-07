/*==================================================
            GOCES FEEDBACK ENGINE v2.0
==================================================*/

const GocesFeedback = (() => {

    /*----------------------------------
                CONFIG
    ----------------------------------*/

    const CONFIG = {

        vibration: true,

        vibrationTime: 10,

        sound: true,

        volume: 0.35,

        soundFile: "assets/audio/click.wav",

        animationDuration: 120

    };

    /*----------------------------------
                AUDIO
    ----------------------------------*/

    let audio = null;

    function initSound() {

        if (!CONFIG.sound) return;

        if (audio) return;

        audio = new Audio(CONFIG.soundFile);

        audio.preload = "auto";

        audio.volume = CONFIG.volume;

    }

    /*----------------------------------
                HAPTIC
    ----------------------------------*/

    function vibrate() {

        if (!CONFIG.vibration) return;

        if (!navigator.vibrate) return;

        navigator.vibrate(CONFIG.vibrationTime);

    }

    /*----------------------------------
                SOUND
    ----------------------------------*/

    function playSound() {

        if (!audio) return;

        try {

            const click = audio.cloneNode();

            click.volume = CONFIG.volume;

            click.play().catch(() => { });

        } catch (e) { }

    }

    /*----------------------------------
            SCALE ANIMATION
    ----------------------------------*/

    function animate(element) {

        if (!element) return;

        if (element.animate) {

            element.animate(
                [
                    {
                        transform: "scale(1)"
                    },
                    {
                        transform: "scale(0.95)"
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

        } else {

            element.style.transition = "transform .12s ease";

            element.style.transform = "scale(.95)";

            setTimeout(() => {

                element.style.transform = "";

            }, CONFIG.animationDuration);

        }

    }

    /*----------------------------------
                PLAY
    ----------------------------------*/

    function play(element = null) {

        vibrate();

        playSound();

        animate(element);

    }

    /*----------------------------------
            AUTO ENABLE
    ----------------------------------*/

    function enableAuto() {

        initSound();

        document.addEventListener("click", function (e) {

            const target = e.target.closest(

                "button,a,[data-feedback],.goces-click"

            );

            if (!target) return;

            play(target);

        });

    }

    /*----------------------------------
                API
    ----------------------------------*/

    return {

        enableAuto,

        play

    };

})();