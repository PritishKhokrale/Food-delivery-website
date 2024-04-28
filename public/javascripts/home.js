gsap.registerPlugin(ScrollTrigger);

// Animate navigation items on page load
gsap.from(".nav", {
    opacity: 0,
    y: -20,
    duration: 1,
    delay: 0.5,
});

// Animate page sections on scroll
gsap.from(".page1", {
    scrollTrigger: {
        trigger: ".page1",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
    },
    opacity: 0,
    y: 20,
    duration: 1,
});

gsap.from(".page2", {
    scrollTrigger: {
        trigger: ".page2",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
    },
    opacity: 0,
    y: 20,
    duration: 1,
});

gsap.from(".footer-container", {
    scrollTrigger: {
        trigger: ".footer-container",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
    },
    opacity: 0,
    y: 20,
    duration: 1,
});

// Optional: Custom cursor effect
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
});

document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
    });
    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
    });
});