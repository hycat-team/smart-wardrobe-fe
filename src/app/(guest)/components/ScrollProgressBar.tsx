"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SCENE_LABELS = ["Tủ đồ số", "AI Stylist", "Trợ lý AI", "Cộng đồng"];

export function ScrollProgressBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    ScrollTrigger.create({
      trigger: ".scrolly-container",
      start: "top top",
      end: "+=12000",
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
        setVisible(self.isActive);
      },
    });
  }, { scope: containerRef });

  const activeScene = Math.min(Math.floor(progress * 4), 3);

  return (
    <div
      ref={containerRef}
      className={`fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-[90] flex flex-col items-end gap-3 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      role="navigation"
      aria-label="Scroll progress"
    >
      {SCENE_LABELS.map((label, i) => (
        <div key={i} className="flex items-center gap-3 group">
          {/* Label (right side, hidden on mobile) */}
          <span
            className={`hidden md:block text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${i === activeScene
                ? "text-[#1A1A1A] opacity-100 translate-x-0"
                : "text-[#707070] opacity-0 translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
              }`}
          >
            {label}
          </span>

          {/* Dot */}
          <div className="relative flex items-center justify-center w-6 h-6">
            <div
              className={`rounded-full transition-all duration-500 ${i === activeScene
                  ? "size-3 bg-[#D9C5B2] shadow-[0_0_12px_rgba(217,197,178,0.5)]"
                  : i < activeScene
                    ? "size-2 bg-[#1A1A1A]"
                    : "size-2 bg-[#1A1A1A]/20"
                }`}
            />
            {/* Active ring */}
            {i === activeScene && (
              <div className="absolute size-6 rounded-full border border-[#D9C5B2]/30 animate-ping" />
            )}
          </div>
        </div>
      ))}

      {/* Progress line */}
      <div className="absolute right-[11.5px] top-[12px] bottom-[12px] w-px bg-[#1A1A1A]/10 -z-10">
        <div
          className="w-full bg-[#D9C5B2]/40 origin-top transition-transform duration-100"
          style={{ transform: `scaleY(${progress})`, height: "100%" }}
        />
      </div>
    </div>
  );
}
