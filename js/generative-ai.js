// LOCOMOTIVE SCROLL
const scrollContainer = document.querySelector("[data-scroll-container]");

const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    lerp: 0.08
});

// GSAP + SCROLLTRIGGER
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
        return arguments.length
            ? scroll.scrollTo(value, { duration: 0, disableLerp: true })
            : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
});

scroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.addEventListener("refresh", () => scroll.update());
ScrollTrigger.refresh();

// HERO ANIMATION
gsap.from(".genai-hero h1", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".genai-hero p", {
    y: 40,
    opacity: 0,
    delay: 0.2,
    duration: 0.8
});

// SECTION ANIMATIONS
gsap.utils.toArray(".genai-section").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            scroller: "[data-scroll-container]",
            start: "top 85%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8
    });
});
