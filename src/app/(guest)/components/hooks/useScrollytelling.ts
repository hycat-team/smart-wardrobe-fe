import { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Custom hook encapsulating all GSAP ScrollTrigger animations for the landing page.
 * Handles mobile vs desktop layouts and respects prefers-reduced-motion.
 */
export function useScrollytelling(containerRef: RefObject<HTMLDivElement | null>) {
  useGSAP(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Show all content statically
      gsap.set(".hero-content, .hero-cta, .copy-1, .copy-2, .copy-3, .copy-4", { opacity: 1, y: 0 });
      gsap.set(".cloth-card", { opacity: 1, scale: 1 });
      return;
    }

    const isMobile = window.innerWidth < 768;
    const scrollDistance = isMobile ? 8000 : 12000;

    // ── Background Parallax & Color Shift ──
    const tlBg = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current?.querySelector('.scrolly-container'),
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: true,
      }
    });

    tlBg.to(".bg-gradient-layer", { backgroundColor: "#EDE8E3", duration: 1 })
      .to(".bg-gradient-layer", { backgroundColor: "#F0E8DC", duration: 1 })
      .to(".bg-gradient-layer", { backgroundColor: "#EBE5DE", duration: 1 })
      .to(".bg-gradient-layer", { backgroundColor: "#E8E4DF", duration: 1 });

    // Ambient Blobs Parallax (desktop only for performance)
    if (!isMobile) {
      gsap.to(".ambient-blob-1", {
        y: 300,
        scrollTrigger: { trigger: containerRef.current?.querySelector('.scrolly-container'), start: "top top", end: `+=${scrollDistance}`, scrub: 0.3 }
      });
      gsap.to(".ambient-blob-2", {
        y: 400,
        scrollTrigger: { trigger: containerRef.current?.querySelector('.scrolly-container'), start: "top top", end: `+=${scrollDistance}`, scrub: 0.5 }
      });
      gsap.to(".ambient-blob-3", {
        x: 100, y: 350,
        scrollTrigger: { trigger: containerRef.current?.querySelector('.scrolly-container'), start: "top top", end: `+=${scrollDistance}`, scrub: 0.4 }
      });
    }

    // ── Main Scrollytelling Timeline ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current?.querySelector('.scrolly-container'),
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
      }
    });

    // ── SCENE 0 → SCENE 1: Digital Wardrobe ──
    tl.to(".hero-content", { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? -30 : 0, duration: 1 })
      .to(".hero-cta", { opacity: 0, y: 50, duration: 1 }, "<");

    tl.add("wardrobe-scan");

    if (isMobile) {
      // Mobile: wardrobe stays centered, just scales down
      tl.to(".wardrobe-container", { scale: 0.45, opacity: 0.8, y: "-20vh", duration: 2, ease: "power2.inOut" }, "wardrobe-scan")
        .fromTo(".scan-line", { y: 0, opacity: 0 }, { y: 300, opacity: 1, duration: 1.5, ease: "power1.inOut" }, "wardrobe-scan")
        .to(".wardrobe-frame-2", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=0.55")
        .to(".wardrobe-frame-3", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=1")
        .to(".scan-line", { opacity: 0, duration: 0.2 })
        // Cards fly out in a tighter grid
        .fromTo(".cloth-card",
          { scale: 0, opacity: 0, x: "0vw", y: "0vh", rotation: 0 },
          {
            scale: 1, opacity: 1,
            stagger: 0.08,
            x: (i: number) => `${(i % 2) * 25 - 12}vw`,
            y: (i: number) => `${Math.floor(i / 2) * 18 + 5}vh`,
            rotation: (i: number) => (i % 2 === 0 ? 3 : -3),
            duration: 1.2,
            ease: "back.out(1.2)"
          },
          "<0.3"
        )
        .fromTo(".copy-1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, "<");
    } else {
      // Desktop: original layout
      tl.to(".wardrobe-container", { x: "-45vw", scale: 0.65, opacity: 0.85, duration: 2, ease: "power2.inOut" }, "wardrobe-scan")
        .fromTo(".scan-line", { y: 0, opacity: 0 }, { y: 600, opacity: 1, duration: 1.5, ease: "power1.inOut" }, "wardrobe-scan")
        .to(".wardrobe-frame-2", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=0.55")
        .to(".wardrobe-frame-3", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=1")
        .to(".scan-line", { opacity: 0, duration: 0.2 })
        .fromTo(".cloth-card",
          { scale: 0, opacity: 0, x: "-25vw", y: "0vh", rotation: 0 },
          {
            scale: 1, opacity: 1,
            stagger: 0.1,
            x: (i: number) => `${(i % 3) * 12}vw`,
            y: (i: number) => `${Math.floor(i / 3) * 22}vh`,
            rotation: (i: number) => (i % 2 === 0 ? 5 : -5),
            duration: 1.5,
            ease: "back.out(1.2)"
          },
          "<0.3"
        )
        .fromTo(".copy-1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");
    }

    // ── SCENE 2: AI Recommendation ──
    const outfitX = isMobile ? "0vw" : "8vw";

    tl.to(".copy-1", { opacity: 0, y: -50, duration: 0.5 })
      .to(".cloth-card:not(.outfit-item)", { scale: 0, opacity: 0, stagger: 0.05, duration: 0.5 })
      .to(".outfit-top", { x: outfitX, y: isMobile ? "-22vh" : "-18vh", rotation: 0, scale: isMobile ? 1 : 1.2, duration: 1.5, ease: "power3.inOut", zIndex: 30 }, "<")
      .to(".outfit-bottom", { x: outfitX, y: isMobile ? "-2vh" : "2vh", rotation: 0, scale: isMobile ? 1 : 1.2, duration: 1.5, ease: "power3.inOut", zIndex: 20 }, "<")
      .to(".outfit-shoes", { x: outfitX, y: isMobile ? "16vh" : "18vh", rotation: 0, scale: isMobile ? 0.9 : 1.1, duration: 1.5, ease: "power3.inOut", zIndex: 10 }, "<")
      .to(".outfit-acc", { x: isMobile ? "18vw" : "22vw", y: "0vh", rotation: 15, scale: isMobile ? 0.8 : 1, duration: 1.5, ease: "power3.inOut", zIndex: 40 }, "<")
      .fromTo(".magic-glow", { opacity: 0, scale: 0, x: "0vw" }, { opacity: 1, scale: 1.5, x: outfitX, duration: 1 }, "<0.5")
      .fromTo(".outfit-ai-core", { scale: 0, opacity: 0, x: outfitX, y: "-2vh" }, { scale: 1, opacity: 1, x: outfitX, y: "-2vh", duration: 1, ease: "back.out(1.5)" }, "<0.2")
      .fromTo(".copy-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // ── SCENE 3: AI Chatbot ──
    tl.to(".copy-2", { opacity: 0, y: -50, duration: 0.5 })
      .to(".outfit-group", { opacity: 0, scale: 0.5, duration: 1 }, "<")
      .to(".wardrobe-container", { opacity: 0, duration: 1 }, "<")
      .fromTo(".chat-interface",
        { opacity: 0, x: "40vw", y: "5vh", scale: 0.9 },
        { opacity: 1, x: isMobile ? "0vw" : "8vw", y: "-5vh", scale: 1, duration: 1.5, ease: "back.out(1)" }, "<")
      .fromTo(".chat-bubble-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
      .fromTo(".chat-bubble-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2");

    // Floating context — show fewer on mobile
    if (!isMobile) {
      tl.fromTo(".chat-float-1", { opacity: 0, x: 40, y: 20, scale: 0.8 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.3")
        .fromTo(".chat-float-2", { opacity: 0, x: -30, y: 30, scale: 0.8 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.2")
        .fromTo(".chat-float-3", { opacity: 0, y: -30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.2")
        .fromTo(".chat-float-4", { opacity: 0, x: 20, y: -20, scale: 0.8 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.2");
    } else {
      // Mobile: show only match score
      tl.fromTo(".chat-float-4", { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.3");
    }

    tl.fromTo(".chat-bubble-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.1")
      .fromTo(".copy-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // ── SCENE 4: Community Feed ──
    tl.to(".copy-3", { opacity: 0, y: -50, duration: 0.5 })
      .to(".chat-interface", { opacity: 0, x: "40vw", duration: 1 }, "<")
      .to(".chat-float-1, .chat-float-2, .chat-float-3, .chat-float-4", { opacity: 0, scale: 0.5, duration: 0.5 }, "<");

    if (isMobile) {
      tl.fromTo(".feed-card-1", { x: "30vw", y: "0vh", opacity: 0, rotation: 10 }, { x: "-3vw", y: "-12vh", opacity: 1, rotation: -2, duration: 1.5, ease: "power2.out" }, "<0.2")
        .fromTo(".feed-card-2", { x: "30vw", y: "0vh", opacity: 0, rotation: -10 }, { x: "5vw", y: "-25vh", opacity: 1, rotation: 3, duration: 1.5, ease: "power2.out" }, "<0.2")
        .fromTo(".feed-card-3", { x: "30vw", y: "0vh", opacity: 0, rotation: 15 }, { x: "0vw", y: "8vh", opacity: 1, rotation: -1, duration: 1.5, ease: "power2.out" }, "<0.2");
    } else {
      tl.fromTo(".feed-card-1", { x: "30vw", y: "0vh", opacity: 0, rotation: 10 }, { x: "-5vw", y: "-8vh", opacity: 1, rotation: -3, duration: 1.5, ease: "power2.out" }, "<0.2")
        .fromTo(".feed-card-2", { x: "30vw", y: "0vh", opacity: 0, rotation: -10 }, { x: "12vw", y: "-15vh", opacity: 1, rotation: 5, duration: 1.5, ease: "power2.out" }, "<0.2")
        .fromTo(".feed-card-3", { x: "30vw", y: "0vh", opacity: 0, rotation: 15 }, { x: "5vw", y: "12vh", opacity: 1, rotation: -2, duration: 1.5, ease: "power2.out" }, "<0.2");
    }

    tl.fromTo(".like-bubble",
      { y: "5vh", opacity: 0, scale: 0 },
      { y: "-15vh", opacity: 1, scale: 1.5, stagger: 0.15, duration: 1.5, ease: "power1.out" }, "<0.5")
      .fromTo(".copy-4", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // ── Static Section Animations ──
    animateStaticSections(isMobile);

  }, { scope: containerRef });
}

/**
 * Animations for non-pinned sections (Social Proof, Before/After, Testimonials, CTA)
 */
function animateStaticSections(isMobile: boolean) {
  // Social Proof Counters
  const counters = gsap.utils.toArray<HTMLElement>(".metric-number");
  counters.forEach(counter => {
    const targetStr = counter.getAttribute("data-target") || "0";
    const targetVal = parseFloat(targetStr.replace(/,/g, ""));
    const suffix = counter.getAttribute("data-suffix") || "";

    gsap.fromTo(counter,
      { textContent: 0 },
      {
        textContent: targetVal,
        duration: 2,
        ease: "power1.out",
        snap: { textContent: 1 },
        onUpdate: function () {
          counter.innerHTML = Math.round(Number(this.targets()[0].textContent)).toLocaleString("en-US") + suffix;
        },
        scrollTrigger: {
          trigger: ".social-proof-section",
          start: "top 80%",
        }
      }
    );
  });

  // Before / After Reveal
  gsap.fromTo(".before-card",
    { x: isMobile ? -30 : -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: ".before-after-section", start: "top 75%" } }
  );
  gsap.fromTo(".after-card",
    { x: isMobile ? 30 : 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: ".before-after-section", start: "top 75%" } }
  );
  gsap.fromTo(".before-item",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, scrollTrigger: { trigger: ".before-card", start: "top 85%" } }
  );
  gsap.fromTo(".after-item",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, scrollTrigger: { trigger: ".after-card", start: "top 85%" } }
  );

  // Testimonials
  gsap.fromTo(".testimonial-bubble",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.25, duration: 0.8, scrollTrigger: { trigger: ".testimonials-section", start: "top 75%" } }
  );

  // Final CTA
  gsap.fromTo(".cta-heading-line",
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.3, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ".final-cta-section", start: "top 60%" } }
  );
  gsap.fromTo(".cta-button",
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)", delay: 0.6, scrollTrigger: { trigger: ".final-cta-section", start: "top 60%" } }
  );
}
