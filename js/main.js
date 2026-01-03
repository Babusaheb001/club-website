/* =========================================================
   LOCOMOTIVE SCROLL INIT
========================================================= */
const scrollContainer = document.querySelector("[data-scroll-container]");
let scroll = null;

if (scrollContainer) {
    scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        lerp: 0.08
    });
}

/* =========================================================
   NAVIGATION SMOOTH SCROLL
========================================================= */
document.querySelectorAll("[data-scroll-to]").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        if (!scroll) return;

        const target = document.getElementById(link.dataset.scrollTo);
        if (target) {
            scroll.scrollTo(target, {
                offset: -80,
                duration: 900
            });
        }
    });
});

/* =========================================================
   FOCUS CARD HOVER + VIDEO (PAUSE → PLAY ON HOVER)
========================================================= */
document.querySelectorAll(".focus-card").forEach(card => {
    const video = card.querySelector(".card-video");

    // Safety check
    if (!video) return;

    // Initial state: paused & hidden
    video.pause();
    video.currentTime = 0;
    video.style.opacity = "1";

    card.style.willChange = "transform, box-shadow, filter";
    card.style.transition =
        "transform 0.6s ease, box-shadow 0.6s ease, filter 0.6s ease";

    card.addEventListener("mouseenter", () => {
        card.style.filter = "brightness(1.05)";
        card.style.transform = "scale(1.05)";
        card.style.boxShadow = "0 0 60px rgba(147, 51, 234, 0.6)";

        // ▶️ Play video on hover
        video.currentTime = 0;
        video.play().catch(() => {});
        video.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "none";
        card.style.boxShadow = "none";
        card.style.filter = "none";

        // ⏸ Pause video on leave
        video.pause();
        video.currentTime = 0;
        video.style.opacity = "1";
    });
});

/* =========================================================
   GSAP LOADER / INTRO
========================================================= */
if (typeof gsap !== "undefined") {
    const tl = gsap.timeline();

    tl.from(".line1 h1", {
        y: 150,
        stagger: 0.2,
        duration: 0.4,
        delay: 0.5,
        ease: "power3.out"
    });

    tl.from("#line1-part1, .line1 h2", {
        opacity: 0,
        onStart: () => {
            const h5 = document.querySelector("#line1-part1 h5");
            if (!h5) return;

            let grow = 0;
            const counter = setInterval(() => {
                if (grow <= 100) h5.innerHTML = grow++;
                else clearInterval(counter);
            }, 35);
        }
    });

    tl.to("#loader", {
        opacity: 0,
        duration: 1.5,
        delay: 3.5,
        onComplete: () => {
            document.querySelector("#loader").style.pointerEvents = "none";
        }
    });

    gsap.from(".navbar", {
        y: -50,
        opacity: 0,
        duration: 1
    });

    gsap.from("#home", {
        y: -120,
        opacity: 0,
        duration: 1,
        delay: 7
    });
}

/* =========================================================
   UNIVERSAL CARD NAVIGATION (FINAL – NO CONFLICT)
========================================================= */
document.querySelectorAll("[data-link]").forEach(card => {
    card.addEventListener("click", () => {
        const link = card.dataset.link;
        if (!link) return;

        // MOBILE → SAME TAB
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
            window.location.href = link;
            return;
        }

        // PATH + ROADMAP → NEW TAB
        if (
            card.classList.contains("path-card") ||
            card.classList.contains("roadmap-card")
        ) {
            window.open(link, "_blank", "noopener,noreferrer");
            return;
        }

        // DESKTOP PAGE TRANSITION
        if (typeof gsap !== "undefined") {
            gsap.to("body", {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    window.location.href = link;
                }
            });
        } else {
            window.location.href = link;
        }
    });
});

/* =========================================================
   TAB SWITCH FIX – LOCOMOTIVE SCROLL
========================================================= */
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && scroll) {
        scroll.update();
    }
});

window.addEventListener("blur", () => {
    if (scroll && scroll.stop) scroll.stop();
});

window.addEventListener("focus", () => {
    if (scroll && scroll.start) {
        scroll.start();
        scroll.update();
    }
});