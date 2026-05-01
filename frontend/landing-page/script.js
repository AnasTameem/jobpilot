document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ═══════════════════════════════════════════
    //  PAGE INTRO — FLUID OVERLAY REVEAL
    // ═══════════════════════════════════════════
    const intro = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    // Fluid SVG wipe
    intro
        .to(".overlay-path", {
            duration: 1.0,
            attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 100 0 0 Z" },
        })
        .to(".overlay-path", {
            duration: 0.5,
            attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" },
            ease: "power2.out",
        }, "-=0.3")
        .set(".transition-overlay", { display: "none" });

    // ═══════════════════════════════════════════
    //  NAVBAR REVEAL
    // ═══════════════════════════════════════════
    intro.to(".navbar", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
    }, "-=0.6");

    // Navbar scroll style
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: () => {
            const scrolled = window.scrollY > 50;
            document.querySelector(".navbar").classList.toggle("scrolled", scrolled);
        },
    });

    // ═══════════════════════════════════════════
    //  HERO — BADGE
    // ═══════════════════════════════════════════
    intro.to(".hero-badge", {
        duration: 0.7,
        opacity: 1,
        y: 0,
        ease: "power3.out",
    }, "-=0.4");

    // ═══════════════════════════════════════════
    //  HERO — TITLE LINES
    // ═══════════════════════════════════════════
    intro.to(".hero-title .line-inner", {
        duration: 1.1,
        y: "0%",
        stagger: 0.12,
        ease: "power4.out",
    }, "-=0.5");

    // ═══════════════════════════════════════════
    //  HERO — DESCRIPTION LINES
    // ═══════════════════════════════════════════
    intro.to(".hero-desc .line-inner", {
        duration: 0.9,
        y: "0%",
        stagger: 0.08,
        ease: "power3.out",
    }, "-=0.7");

    // ═══════════════════════════════════════════
    //  HERO — BUTTONS
    // ═══════════════════════════════════════════
    intro.to(".hero-actions", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
    }, "-=0.5");

    // ═══════════════════════════════════════════
    //  HERO — STATS
    // ═══════════════════════════════════════════
    intro.to(".hero-stats", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
    }, "-=0.5");

    // ═══════════════════════════════════════════
    //  HERO — DECORATIVE BLOBS
    // ═══════════════════════════════════════════
    intro.to(".hero-blob", {
        duration: 1.5,
        opacity: 0.45,
        stagger: 0.15,
        ease: "power2.out",
    }, "-=1.2");

    // Gentle floating for blobs
    gsap.to(".blob-1", { y: 20, x: -15, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { y: -25, x: 10, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
    gsap.to(".blob-3", { y: 15, x: -10, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

    // ═══════════════════════════════════════════
    //  HERO — APP PREVIEW CARD
    // ═══════════════════════════════════════════
    intro.to(".hero-visual", {
        duration: 1.2,
        opacity: 1,
        y: 0,
        rotateY: 0,
        rotateX: 0,
        ease: "power3.out",
    }, "-=1.0");

    // Stagger job cards inside the preview
    intro.to(".app-job-card", {
        duration: 0.6,
        opacity: 1,
        x: 0,
        stagger: 0.15,
        ease: "power3.out",
    }, "-=0.6");

    // Animate match bars after cards appear
    intro.add(() => {
        document.querySelectorAll(".match-fill").forEach((bar) => {
            const width = bar.style.width;
            bar.style.width = "0%";
            gsap.to(bar, {
                width: width,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.2,
            });
        });
    }, "-=0.3");

    // ═══════════════════════════════════════════
    //  HERO — PARALLAX ON SCROLL
    // ═══════════════════════════════════════════
    gsap.to(".hero-content", {
        y: -80,
        opacity: 0.2,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
        },
    });

    gsap.to(".hero-visual", {
        y: -40,
        scale: 0.95,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
        },
    });

    gsap.to(".hero-blob", {
        scale: 1.3,
        opacity: 0,
        scrollTrigger: {
            trigger: ".hero",
            start: "center center",
            end: "bottom top",
            scrub: 1,
        },
    });

    // ═══════════════════════════════════════════
    //  HOW IT WORKS — SECTION LABEL
    // ═══════════════════════════════════════════
    gsap.to(".how-it-works::after", {
        y: 100,
        scrollTrigger: {
            trigger: ".how-it-works",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });

    gsap.to(".section-label", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".section-label",
            start: "top 88%",
        },
    });

    // Section title line reveals
    const sectionTitles = document.querySelectorAll(".section-title");
    sectionTitles.forEach((title) => {
        const lines = title.querySelectorAll(".line-inner");
        if (lines.length > 0) {
            gsap.to(lines, {
                y: "0%",
                duration: 1.1,
                stagger: 0.12,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                },
            });
        }
    });

    // ═══════════════════════════════════════════
    // ═══════════════════════════════════════════
    //  HOW IT WORKS — DECK STACK ANIMATION
    // ═══════════════════════════════════════════
    const stepsSection = document.querySelector(".how-it-works");
    const stepsGrid = document.querySelector(".steps-grid");
    const cards = gsap.utils.toArray(".step-card");
    
    // 1. Initial Stacking (Deck Look)
    cards.forEach((card, i) => {
        gsap.set(card, {
            zIndex: cards.length - i,
            scale: 1 - (i * 0.04),
            y: i * 15, // Subtle downward offset
            opacity: 1 - (i * 0.15), // Fade cards as they get deeper
        });
    });

    // 2. Timeline for the "Deck Drop" effect
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: stepsSection,
            start: "top -10%", // Resetting to a more standard start for compactness
            end: () => `+=${stepsGrid.offsetHeight * 2.5}`, 
            pin: true,
            scrub: 1,
            anticipatePin: 1,
        }
    });

    cards.forEach((card, i) => {
        // We only animate the card "leaving" if it's not the last one
        if (i < cards.length - 1) {
            const nextCards = cards.slice(i + 1);
            
            // The current front card drops down and away
            tl.to(card, {
                y: "120%",
                opacity: 0,
                scale: 0.9,
                rotationX: -15,
                duration: 1,
                ease: "power2.inOut"
            }, i);

            // All cards behind it shift forward
            nextCards.forEach((nextCard, j) => {
                tl.to(nextCard, {
                    y: j * 15, // Moves to the position of the card in front of it
                    scale: 1 - (j * 0.04),
                    opacity: 1 - (j * 0.15),
                    duration: 1,
                    ease: "power2.inOut"
                }, i);
            });
        }
    });

    // Refined Hover for the active (front) card
    cards.forEach((card, i) => {
        card.addEventListener("mousemove", (e) => {
            // Only tilt if the card is at the front (y is 0 and it's visible)
            const yPos = gsap.getProperty(card, "y");
            const opacity = gsap.getProperty(card, "opacity");
            
            if (yPos > 5 || opacity < 0.9) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            gsap.to(card, {
                rotateX: ((y - centerY) / centerY) * -4,
                rotateY: ((x - centerX) / centerX) * 4,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });

    // ═══════════════════════════════════════════
    //  PRIVACY BANNER REVEAL
    // ═══════════════════════════════════════════
    gsap.to(".privacy-inner", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".privacy-banner",
            start: "top 85%",
        },
    });

    // ═══════════════════════════════════════════
    //  FOOTER REVEAL
    // ═══════════════════════════════════════════
    gsap.from(".footer-top", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer",
            start: "top 85%",
        },
    });

    // ═══════════════════════════════════════════
    //  BUTTON HOVER MICRO-INTERACTIONS
    // ═══════════════════════════════════════════
    document.querySelectorAll(".btn-primary").forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 1.03, duration: 0.3, ease: "power2.out" });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        });
    });

    // Nav button hover
    const navBtn = document.querySelector(".nav-btn");
    if (navBtn) {
        navBtn.addEventListener("mouseenter", () => {
            gsap.to(navBtn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        navBtn.addEventListener("mouseleave", () => {
            gsap.to(navBtn, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        });
    }

    // ═══════════════════════════════════════════
    //  APP PREVIEW — SUBTLE FLOAT
    // ═══════════════════════════════════════════
    gsap.to(".app-preview", {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });
});
