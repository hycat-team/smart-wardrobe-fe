"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HOW_IT_WORKS_STEPS } from "../data/landing-data";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(".step-card",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".how-it-works-section", start: "top 75%" }
      }
    );

    gsap.fromTo(".step-connector",
      { scaleX: 0 },
      {
        scaleX: 1,
        stagger: 0.3,
        duration: 0.6,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ".how-it-works-section", start: "top 70%" }
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="how-it-works-section w-full py-24 md:py-32 px-6 bg-[#F4F1EE] relative z-10"
      role="region"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-6 shadow-sm">
            Cách hoạt động
          </div>
          <h2
            id="how-it-works-heading"
            className="font-heading text-4xl md:text-6xl text-[#1A1A1A] font-medium"
          >
            3 Bước Đơn Giản
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-[60px] left-[calc(33.33%+20px)] right-[calc(33.33%+20px)] z-0">
            <div className="step-connector h-px bg-[#D9C5B2]/40 w-full origin-left" />
          </div>
          <div className="hidden md:block absolute top-[60px] left-[calc(66.66%-20px)] w-[calc(33.33%-40px)] z-0">
            <div className="step-connector h-px bg-[#D9C5B2]/40 w-full origin-left" />
          </div>

          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="step-card opacity-0 group relative bg-white rounded-3xl p-8 md:p-10 border border-[#1A1A1A]/5 shadow-sm hover:shadow-lg transition-shadow duration-300 z-10"
            >
              {/* Step number */}
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 md:size-14 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white font-heading text-xl md:text-2xl font-bold group-hover:bg-[#D9C5B2] transition-colors duration-300">
                  {step.number}
                </div>
                <span className="text-3xl">{step.emoji}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-3">
                {step.title}
              </h3>
              <p className="text-[#5A5A5A] text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
