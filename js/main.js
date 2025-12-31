/* =========================================================
   LOCOMOTIVE SCROLL INIT
========================================================= */
const scrollContainer = document.querySelector("[data-scroll-container]");

/* EFFICIENCY: Only initialize if container exists */
let scroll;
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

        if (!scroll) return; // Safety check

        const targetId = link.dataset.scrollTo;
        const target = document.getElementById(targetId);
        
        if (target) {
            scroll.scrollTo(target, {
                offset: -80,
                duration: 900
            });
        }
    });
});

/* =========================================================
   FOCUS CARD HOVER + VIDEO
========================================================= */
document.querySelectorAll(".focus-card").forEach(card => {
    const video = card.querySelector(".card-video");
    let hoverTimer1, hoverTimer2;

    /* EFFICIENCY: Set Will-Change to hint browser for optimization */
    card.style.willChange = "transform, box-shadow, filter";
    card.style.transition = "transform 0.6s ease, box-shadow 0.6s ease, filter 0.6s ease";

    card.addEventListener("mouseenter", () => {
        card.style.filter = "brightness(1.05)";

        hoverTimer1 = setTimeout(() => {
            requestAnimationFrame(() => {
                card.style.transform = "scale(1.05)";
                card.style.boxShadow = "0 0 60px rgba(147, 51, 234, 0.6)";
            });
        }, 200);

        hoverTimer2 = setTimeout(() => {
            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {}); // Prevent error if user hasn't interacted
                video.style.opacity = "1";
            }
        }, 700);
    });

    card.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimer1);
        clearTimeout(hoverTimer2);

        requestAnimationFrame(() => {
            card.style.transform = "none";
            card.style.boxShadow = "none";
            card.style.filter = "none";
        });

        if (video) {
            video.pause();
            video.currentTime = 0;
            video.style.opacity = "0";
        }
    });

    /* CLICK NAVIGATION */
    card.addEventListener("click", () => {
        const link = card.dataset.link;
        if (link) window.location.href = link;
    });
});

/* =========================================================
   GSAP LOADER / INTRO ANIMATION
========================================================= */
if (typeof gsap !== "undefined") {

    const tl = gsap.timeline();

    /* Headline animation */
    tl.from(".line h1", {
        y: 150,
        stagger: 0.2,
        duration: 0.4,
        delay: 0.5,
        ease: "power3.out"
    });

    /* Counter animation */
    tl.from("#line1-part1, .line h2", {
        opacity: 0,
        onStart: function () {
            const h5 = document.querySelector("#line1-part1 h5");
            if (!h5) return;

            let grow = 0;
            const counter = setInterval(() => {
                if (grow <= 100) {
                    h5.innerHTML = grow++;
                } else {
                    clearInterval(counter);
                }
            }, 35);
        }
    });

    /* Loader fade out */
    tl.to("#loader", {
        opacity: 0,
        duration: 0.4,
        delay: 3.5,
        onComplete: () => {
            document.querySelector("#loader").style.pointerEvents = "none";
        }
    });
    
    /* Extra Intro Animation (Kept as requested) */
    var time = gsap.timeline();
    time.from(".navbar", {
        y: -50,
        opacity: 0,
        delay: 0.2,
        duration: 1,
        stagger: 0.4
    });
    time.from("#home", {
        y: -120,
        opacity: 0,
        delay: 0.2,
        duration: 1,
        stagger: 0.4
    });
}

/* =========================================================
   LEARNING PATHS CLICK → OPEN IN NEW TAB
========================================================= */
document.querySelectorAll(".path-card").forEach(card => {
    card.addEventListener("click", () => {
        const link = card.dataset.link;
        if (link && link.trim() !== "") {
            window.open(link, "_blank");
        }
    });
});

/* =========================================================
   NOTE ON MOBILE VIDEO:
   The original code had 3 conflicting blocks for mobile video.
   I have disabled the first two inefficient ones and kept 
   the most optimized (GSAP One-At-A-Time) version active below.
========================================================= */

/* [DISABLED] BLOCK 1: IntersectionObserver (Less precise than ScrollTrigger) */
/* if (window.innerWidth <= 600) {
   // ... IntersectionObserver Logic ...
}
*/

/* [DISABLED] BLOCK 2: Basic ScrollTrigger (Plays all videos in view, heavy on battery) */
/* if (window.innerWidth <= 600) {
   // ... Basic GSAP Logic ...
}
*/

/* =========================================================
   MOBILE GSAP VIDEO CONTROL (OPTIMIZED: ONE AT A TIME)
========================================================= */
if (window.innerWidth <= 600 && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {

    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll(".focus-card");
    let activeVideo = null; // 👈 track currently playing video

    cards.forEach(card => {
        const video = card.querySelector(".card-video");
        if (!video) return;

        ScrollTrigger.create({
            trigger: card,
            start: "top 55%",
            end: "bottom 45%",

            onEnter: () => switchVideo(video),
            onEnterBack: () => switchVideo(video),
            onLeave: () => stopVideo(video),
            onLeaveBack: () => stopVideo(video)
        });
    });

    function switchVideo(video) {
        if (activeVideo && activeVideo !== video) {
            activeVideo.pause();
            activeVideo.currentTime = 0;
        }

        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {});
        activeVideo = video;
    }

    function stopVideo(video) {
        if (video === activeVideo) {
            video.pause();
            video.currentTime = 0;
            activeVideo = null;
        }
    }
}

/* =========================================================
   ROADMAP CARD – CURSOR DIRECTION GLOW (OPTIMIZED)
========================================================= */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

    document.querySelectorAll(".roadmap-card").forEach(card => {
        
        let frame; // Variable to store the animation frame ID

        card.addEventListener("mousemove", e => {
            // Cancel previous frame to prevent stacking calculations
            if (frame) cancelAnimationFrame(frame);

            // Schedule the visual update for the next screen refresh
            frame = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty("--x", `${x}%`);
                card.style.setProperty("--y", `${y}%`);
            });
        });
    });
}

/* =========================================================
   UNIVERSAL CARD NAVIGATION SYSTEM
========================================================= */
document.querySelectorAll("[data-link]").forEach(card => {
    card.addEventListener("click", () => {
        const link = card.dataset.link;
        if (!link) return;

        // MOBILE → DIRECT NAVIGATION
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
            window.location.href = link;
            return;
        }

        // ROADMAP → NEW TAB (DESKTOP)
        if (card.classList.contains("roadmap-card")) {
            window.open(link, "_blank", "noopener");
            return;
        }

        // DESKTOP → FADE TRANSITION
        if (typeof gsap !== "undefined") {
            gsap.to("body", {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    window.location.href = link;
                }
            });
        } else {
            // Fallback if GSAP fails
            window.location.href = link;
        }
    });
});

/* =========================================================
   PROGRAMMING FOUNDATIONS – GSAP ANIMATIONS
========================================================= */
if (document.querySelector(".pf-hero") && typeof gsap !== "undefined") {

    /* HERO INTRO */
    gsap.from(".pf-hero h1", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".pf-hero p", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
    });

    gsap.from(".pf-meta", {
        opacity: 0,
        duration: 0.6,
        delay: 0.4
    });

    /* SECTION TITLES */
    gsap.utils.toArray(".pf-section .section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                scroller: "[data-scroll-container]",
                start: "top 85%"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    /* PARAGRAPH TEXT */
    gsap.utils.toArray(".pf-text").forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                scroller: "[data-scroll-container]",
                start: "top 90%"
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out"
        });
    });

    /* BULLET POINTS */
    gsap.utils.toArray(".pf-points").forEach(list => {
        gsap.from(list.children, {
            scrollTrigger: {
                trigger: list,
                scroller: "[data-scroll-container]",
                start: "top 90%"
            },
            y: 20,
            opacity: 0,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    /* PF CARDS */
    gsap.utils.toArray(".pf-card").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                scroller: "[data-scroll-container]",
                start: "top 85%"
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        });
    });

    /* NEXT STEP CTA */
    gsap.from(".pf-next", {
        scrollTrigger: {
            trigger: ".pf-next",
            scroller: "[data-scroll-container]",
            start: "top 85%"
        },
        y: 80,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out"
    });
}