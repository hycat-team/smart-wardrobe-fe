/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowDown, Check, Heart, MessageCircle, Share2,
  Clock, Smartphone, Target, Timer, Shirt, AlertCircle, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LandingClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Dynamic Background Parallax & Color Shift
    const tlBg = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrolly-container",
        start: "top top",
        end: "+=12000",
        scrub: true,
      }
    });

    tlBg.to(".bg-gradient-layer", { backgroundColor: "#EDE8E3", duration: 1 })
      .to(".bg-gradient-layer", { backgroundColor: "#F0E8DC", duration: 1 })
      .to(".bg-gradient-layer", { backgroundColor: "#EBE5DE", duration: 1 })
      .to(".bg-gradient-layer", { backgroundColor: "#E8E4DF", duration: 1 });

    // Ambient Blobs Parallax
    gsap.to(".ambient-blob-1", {
      y: 300,
      scrollTrigger: { trigger: ".scrolly-container", start: "top top", end: "+=12000", scrub: 0.3 }
    });
    gsap.to(".ambient-blob-2", {
      y: 400,
      scrollTrigger: { trigger: ".scrolly-container", start: "top top", end: "+=12000", scrub: 0.5 }
    });
    gsap.to(".ambient-blob-3", {
      x: 100, y: 350,
      scrollTrigger: { trigger: ".scrolly-container", start: "top top", end: "+=12000", scrub: 0.4 }
    });

    // Main Scrollytelling Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrolly-container",
        start: "top top",
        end: "+=12000",
        scrub: 2.5,
        pin: true,
      }
    });

    // SCENE 0 -> SCENE 1: Digital Wardrobe
    tl.to(".hero-content", { opacity: 0, x: -50, duration: 1 })
      .to(".hero-cta", { opacity: 0, y: 50, duration: 1 }, "<")

    tl.add("wardrobe-scan")
      // Wardrobe starts moving left DURING the scan (earlier storytelling)
      .to(".wardrobe-container", { x: "-45vw", scale: 0.65, opacity: 0.85, duration: 2, ease: "power2.inOut" }, "wardrobe-scan")
      .fromTo(".scan-line", { top: "0%", opacity: 0 }, { top: "100%", opacity: 1, duration: 1.5, ease: "power1.inOut" }, "wardrobe-scan")
      .to(".wardrobe-frame-2", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=0.55")
      .to(".wardrobe-frame-3", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=1")
      .to(".scan-line", { opacity: 0, duration: 0.2 })
      // Clothes fly out FROM the wardrobe position (left) to the right grid
      .fromTo(".cloth-card",
        { scale: 0, opacity: 0, x: "-25vw", y: "0vh", rotation: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          x: (i) => `${(i % 3) * 12}vw`,
          y: (i) => `${Math.floor(i / 3) * 22}vh`,
          rotation: (i) => (i % 2 === 0 ? 5 : -5),
          duration: 1.5,
          ease: "back.out(1.2)"
        },
        "<0.3"
      )
      .fromTo(".copy-1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // SCENE 2: AI Recommendation
    tl.to(".copy-1", { opacity: 0, y: -50, duration: 0.5 })
      .to(".cloth-card:not(.outfit-item)", { scale: 0, opacity: 0, stagger: 0.05, duration: 0.5 })
      // Assemble Outfit Center-Right
      .to(".outfit-top", { x: "8vw", y: "-18vh", rotation: 0, scale: 1.2, duration: 1.5, ease: "power3.inOut", zIndex: 30 }, "<")
      .to(".outfit-bottom", { x: "8vw", y: "2vh", rotation: 0, scale: 1.2, duration: 1.5, ease: "power3.inOut", zIndex: 20 }, "<")
      .to(".outfit-shoes", { x: "8vw", y: "18vh", rotation: 0, scale: 1.1, duration: 1.5, ease: "power3.inOut", zIndex: 10 }, "<")
      .to(".outfit-acc", { x: "22vw", y: "0vh", rotation: 15, scale: 1, duration: 1.5, ease: "power3.inOut", zIndex: 40 }, "<")
      // Magic glow
      .fromTo(".magic-glow", { opacity: 0, scale: 0, x: "0vw" }, { opacity: 1, scale: 1.5, x: "8vw", duration: 1 }, "<0.5")
      // AI Core Appears
      .fromTo(".outfit-ai-core", { scale: 0, opacity: 0, x: "8vw", y: "-2vh" }, { scale: 1, opacity: 1, x: "8vw", y: "-2vh", duration: 1, ease: "back.out(1.5)" }, "<0.2")
      .fromTo(".copy-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // SCENE 3: AI Chatbot
    tl.to(".copy-2", { opacity: 0, y: -50, duration: 0.5 })
      // Hide Outfit completely
      .to(".outfit-group", { opacity: 0, scale: 0.5, duration: 1 }, "<")
      .to(".wardrobe-container", { opacity: 0, duration: 1 }, "<")
      // Show Chat (larger, more prominent)
      .fromTo(".chat-interface", { opacity: 0, x: "40vw", y: "5vh", scale: 0.9 }, { opacity: 1, x: "8vw", y: "-5vh", scale: 1, duration: 1.5, ease: "back.out(1)" }, "<")
      .fromTo(".chat-bubble-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
      .fromTo(".chat-bubble-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
      // Floating context elements around chat
      .fromTo(".chat-float-1", { opacity: 0, x: 40, y: 20, scale: 0.8 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.3")
      .fromTo(".chat-float-2", { opacity: 0, x: -30, y: 30, scale: 0.8 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.2")
      .fromTo(".chat-float-3", { opacity: 0, y: -30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.2")
      .fromTo(".chat-float-4", { opacity: 0, x: 20, y: -20, scale: 0.8 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "<0.2")
      .fromTo(".chat-bubble-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.1")
      .fromTo(".copy-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // SCENE 4: Community Feed
    tl.to(".copy-3", { opacity: 0, y: -50, duration: 0.5 })
      .to(".chat-interface", { opacity: 0, x: "40vw", duration: 1 }, "<")
      .to(".chat-float-1, .chat-float-2, .chat-float-3, .chat-float-4", { opacity: 0, scale: 0.5, duration: 0.5 }, "<")
      // Feeds appear Center-Right
      .fromTo(".feed-card-1", { x: "30vw", y: "0vh", opacity: 0, rotation: 10 }, { x: "-5vw", y: "-8vh", opacity: 1, rotation: -3, duration: 1.5, ease: "power2.out" }, "<0.2")
      .fromTo(".feed-card-2", { x: "30vw", y: "0vh", opacity: 0, rotation: -10 }, { x: "12vw", y: "-15vh", opacity: 1, rotation: 5, duration: 1.5, ease: "power2.out" }, "<0.2")
      .fromTo(".feed-card-3", { x: "30vw", y: "0vh", opacity: 0, rotation: 15 }, { x: "5vw", y: "12vh", opacity: 1, rotation: -2, duration: 1.5, ease: "power2.out" }, "<0.2")
      // Like bubbles
      .fromTo(".like-bubble", { y: "5vh", opacity: 0, scale: 0 }, { y: "-15vh", opacity: 1, scale: 1.5, stagger: 0.15, duration: 1.5, ease: "power1.out" }, "<0.5")
      .fromTo(".copy-4", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // NEW COMPONENTS ANIMATIONS
    // 1. Social Proof Counters
    const counters = gsap.utils.toArray<HTMLElement>(".metric-number");
    counters.forEach(counter => {
      const targetStr = counter.getAttribute("data-target") || "0";
      const targetVal = parseFloat(targetStr.replace(/,/g, ''));
      const suffix = counter.getAttribute("data-suffix") || "";

      gsap.fromTo(counter,
        { textContent: 0 },
        {
          textContent: targetVal,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          onUpdate: function () {
            counter.innerHTML = Math.round(Number(this.targets()[0].textContent)).toLocaleString('en-US') + suffix;
          },
          scrollTrigger: {
            trigger: ".social-proof-section",
            start: "top 80%",
          }
        }
      );
    });

    // 2. Before / After Reveal
    gsap.fromTo(".before-card",
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: ".before-after-section", start: "top 75%" } }
    );
    gsap.fromTo(".after-card",
      { x: 60, opacity: 0 },
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

    // 3. Testimonials
    gsap.fromTo(".testimonial-bubble",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.25, duration: 0.8, scrollTrigger: { trigger: ".testimonials-section", start: "top 75%" } }
    );

    // 4. Final CTA
    gsap.fromTo(".cta-heading-line",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.3, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ".final-cta-section", start: "top 60%" } }
    );
    gsap.fromTo(".cta-button",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)", delay: 0.6, scrollTrigger: { trigger: ".final-cta-section", start: "top 60%" } }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#F4F1EE] text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-[#D9C5B2] selection:text-white">

      {/* Grain overlay */}
      <div className="grain-overlay mix-blend-multiply" />

      {/* 1. SCROLLYTELLING CONTAINER */}
      <section className="scrolly-container relative w-full h-[100vh] flex items-center justify-center overflow-hidden">

        {/* Background Layers */}
        <div className="bg-gradient-layer absolute inset-0 z-0 bg-[#F4F1EE]" />

        {/* Ambient Blobs */}
        <div className="ambient-blob-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-[radial-gradient(circle,_#D9C5B2_0%,_transparent_70%)] opacity-[0.12] z-[1] pointer-events-none mix-blend-multiply" />
        <div className="ambient-blob-2 absolute top-[40%] right-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-[radial-gradient(circle,_#E8DFD4_0%,_transparent_70%)] opacity-[0.12] z-[1] pointer-events-none mix-blend-multiply" />
        <div className="ambient-blob-3 absolute top-[70%] left-[40%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-[radial-gradient(circle,_#D4DECE_0%,_transparent_70%)] opacity-[0.12] z-[1] pointer-events-none mix-blend-multiply" />

        {/* HERO CONTENT (Scene 0) */}
        <div className="hero-content absolute left-[5vw] top-1/2 -translate-y-1/2 text-left z-50 flex flex-col items-start gap-2 max-w-[50vw]">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-[#1A1A1A] leading-[0.9]">
            Tủ đầy ắp đồ,<br />nhưng lại...
          </h1>
          <h2 className="font-heading text-4xl md:text-6xl text-[#D9C5B2] italic mt-4">
            "Hôm nay mặc gì?"
          </h2>
        </div>

        <div className="hero-cta absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-xs font-medium uppercase tracking-widest text-[#707070]">Cuộn để mở khóa tủ đồ ↓</span>
        </div>

        {/* CENTRAL WARDROBE (Scene 0 -> Scene 1) */}
        <div className="wardrobe-container absolute right-[8vw] top-1/2 -translate-y-1/2 z-20 scale-[1.2] flex justify-center items-center h-[600px] w-[600px]">
          <div className="relative w-full h-full">
            {/* Frame 1 */}
            <Image
              src="/landing-page/wardrobe-closed-1.png"
              alt="Wardrobe Frame 1"
              fill
              className="wardrobe-frame-1 object-contain z-10"
              priority
            />
            {/* Frame 2 */}
            <Image
              src="/landing-page/wardrobe-closed-2.png"
              alt="Wardrobe Frame 2"
              fill
              className="wardrobe-frame-2 object-contain opacity-0 z-20"
            />
            {/* Frame 3 */}
            <Image
              src="/landing-page/wardrobe-closed-3.png"
              alt="Wardrobe Frame 3"
              fill
              className="wardrobe-frame-3 object-contain opacity-0 z-30"
            />
            {/* Scan Line Effect */}
            <div className="scan-line absolute left-25 w-[400px] h-1 bg-[#f5b158] shadow-[0_0_20px_5px_rgba(217,197,178,0.5)] z-20 opacity-0 rounded-full" />
          </div>
        </div>

        {/* CLOTHING CARDS & OUTFIT (Scene 1 & 2) */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="outfit-group relative w-full h-full flex items-center justify-center">

            {/* Magic Glow for Scene 2 */}
            <div className="magic-glow absolute opacity-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_#D9C5B2_0%,_transparent_70%)] mix-blend-multiply -z-10 translate-x-[8vw]" />

            {/* Non-Outfit Items (Hide later) */}
            <ClothCard src="/landing-page/bottom-2.png" className="cloth-card top-[30vh] left-[45vw]" />
            <ClothCard src="/landing-page/top-2.png" className="cloth-card top-[40vh] left-[50vw]" />

            {/* AI Avatar Core */}
            <div className="outfit-ai-core absolute top-[40vh] left-[51vw] opacity-0 size-28 md:size-52 rounded-full border border-white bg-white overflow-hidden z-25 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <Image src="/landing-page/Robot-AI.png" alt="AI Core" fill className="object-cover p-3" />
            </div>

            {/* Outfit Items */}
            <ClothCard src="/landing-page/top-1.png" className="cloth-card outfit-item outfit-top top-[25vh] left-[55vw]" />
            <ClothCard src="/landing-page/bottom-1.png" className="cloth-card outfit-item outfit-bottom top-[45vh] left-[40vw]" />
            <ClothCard src="/landing-page/shoe-1.png" className="cloth-card outfit-item outfit-shoes top-[60vh] left-[60vw]" />
            <ClothCard src="/landing-page/acc-1.png" className="cloth-card outfit-item outfit-acc top-[35vh] left-[65vw]" />
          </div>
        </div>

        {/* CHAT INTERFACE (Scene 3) */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          {/* Main Chat Window (larger) */}
          <div className="chat-interface opacity-0 w-[380px] p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl absolute">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1A1A1A]/5">
              <div className="relative size-12 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#1A1A1A]/10 shadow-sm">
                <Image src="/landing-page/Robot-AI.png" alt="AI" fill className="object-cover p-1" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-[#1A1A1A]">Closy AI</h4>
                <p className="text-xs text-[#D9C5B2] uppercase tracking-widest font-bold">Stylist Cá Nhân</p>
              </div>
              <div className="ml-auto flex gap-1">
                <div className="size-2 rounded-full bg-[#4A8C6E] animate-pulse" />
                <span className="text-[10px] text-[#4A8C6E] font-medium">Trực tuyến</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="chat-bubble-1 opacity-0 bg-[#F4F1EE] text-[#1A1A1A] text-sm p-4 rounded-2xl rounded-tl-sm w-[90%] border border-[#1A1A1A]/5">
                Thứ 7 này đi dạo phố mặc gì?
              </div>
              <div className="chat-bubble-2 opacity-0 bg-[#D9C5B2] text-white text-sm p-4 rounded-2xl rounded-tr-sm w-[95%] ml-auto shadow-md">
                Thử set này nhé: Thun basic và Jeans ống rộng cực thoải mái!
              </div>
              <div className="chat-bubble-3 opacity-0 bg-[#F4F1EE] text-[#1A1A1A] text-sm p-4 rounded-2xl rounded-tl-sm w-[85%] border border-[#1A1A1A]/5">
                Có set nào khác trendy hơn không? 👀
              </div>
            </div>

            {/* Typing input mock */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-[#F4F1EE] border border-[#1A1A1A]/5">
              <div className="flex-1 text-xs text-[#A3A3A3]">Nhập tin nhắn...</div>
              <div className="size-8 rounded-full bg-[#D9C5B2] flex items-center justify-center">
                <ArrowDown className="size-3 text-white rotate-[-90deg]" />
              </div>
            </div>
          </div>

          {/* Floating Context Elements around Chat */}
          {/* Weather Widget - top right */}
          <div className="chat-float-1 absolute opacity-0 top-[15vh] right-[15vw] bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/60 flex items-center gap-3">
            <span className="text-2xl">☀️</span>
            <div>
              <div className="text-xs font-bold text-[#1A1A1A]">Hôm nay</div>
              <div className="text-[10px] text-[#707070]">32°C — Nắng nhẹ</div>
            </div>
          </div>

          {/* Outfit suggestion mini-card - bottom right */}
          <div className="chat-float-2 absolute opacity-0 bottom-[15vh] right-[12vw] bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/60 w-[180px]">
            <div className="text-[10px] uppercase tracking-widest text-[#D9C5B2] font-bold mb-2">Gợi ý outfit</div>
            <div className="flex gap-2">
              <div className="relative size-14 rounded-xl bg-[#F4F1EE] overflow-hidden border border-[#1A1A1A]/5">
                <Image src="/landing-page/top-1.png" alt="Top" fill className="object-contain p-1" />
              </div>
              <div className="relative size-14 rounded-xl bg-[#F4F1EE] overflow-hidden border border-[#1A1A1A]/5">
                <Image src="/landing-page/bottom-1.png" alt="Bottom" fill className="object-contain p-1" />
              </div>
              <div className="relative size-14 rounded-xl bg-[#F4F1EE] overflow-hidden border border-[#1A1A1A]/5">
                <Image src="/landing-page/shoe-1.png" alt="Shoes" fill className="object-contain p-1" />
              </div>
            </div>
          </div>

          {/* Style tag - top left */}
          <div className="chat-float-3 absolute opacity-0 top-[22vh] left-[42vw] flex gap-2">
            <div className="bg-[#1A1A1A] text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-md">Streetwear</div>
            <div className="bg-white/80 backdrop-blur-md text-[#1A1A1A] text-[10px] px-3 py-1.5 rounded-full font-bold border border-[#1A1A1A]/10 shadow-sm">Casual</div>
          </div>

          {/* Match score - bottom left */}
          <div className="chat-float-4 absolute opacity-0 bottom-[25vh] left-[40vw] bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/60 flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#4A8C6E]/10 flex items-center justify-center">
              <Check className="size-5 text-[#4A8C6E]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A1A1A]">Phù hợp 95%</div>
              <div className="text-[10px] text-[#707070]">Với phong cách của bạn</div>
            </div>
          </div>
        </div>

        {/* COMMUNITY FEED (Scene 4) */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <FeedCard src="/landing-page/feed-1.png" className="feed-card-1" likes="1.2k" user="@fashionista" />
          <FeedCard src="/landing-page/feed-2.png" className="feed-card-2" likes="856" user="@minimalist" />
          <FeedCard src="/landing-page/feed-3.png" className="feed-card-3" likes="2.4k" user="@genz.style" />

          {/* Floating Likes */}
          <Heart className="like-bubble absolute top-[50vh] left-[40vw] text-red-500 fill-red-500 opacity-0 size-8" />
          <Heart className="like-bubble absolute top-[40vh] left-[60vw] text-red-400 fill-red-400 opacity-0 size-6" />
          <Heart className="like-bubble absolute top-[60vh] left-[55vw] text-red-500 fill-red-500 opacity-0 size-10" />
        </div>

        {/* COPY TEXTS (Left Side - vertically centered) */}
        <div className="absolute top-[38%] left-[5vw] z-50 w-[35vw] max-w-[300px] text-left pointer-events-none">
          <div className="copy-1 opacity-0 absolute top-0 left-0 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <Sparkles className="size-3" /> Tủ đồ kỹ thuật số
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight whitespace-nowrap">
              Số hoá tủ đồ.
            </h2>
            <p className="text-[#707070] text-lg">Chụp 1 lần. AI tự động bóc tách nền, phân loại màu sắc và chất liệu.</p>
          </div>

          <div className="copy-2 opacity-0 absolute top-0 left-0 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <Check className="size-3" /> Gợi ý từ AI
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight whitespace-nowrap">
              Stylist Cá Nhân.
            </h2>
            <p className="text-[#707070] text-lg">Hàng ngàn gợi ý phối đồ từ chính tủ đồ của bạn. Đổi món cực nhanh chỉ với 1 chạm.</p>
          </div>

          <div className="copy-3 opacity-0 absolute top-0 left-0 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <MessageCircle className="size-3" /> Trợ lý AI
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight whitespace-nowrap">
              Hiểu gu của bạn.
            </h2>
            <p className="text-[#707070] text-lg">Closy phân tích thời tiết, hoàn cảnh và thấu hiểu phong cách riêng để tư vấn mỗi ngày.</p>
          </div>

          <div className="copy-4 opacity-0 absolute top-0 left-0 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <Share2 className="size-3" /> Cộng đồng
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight whitespace-nowrap">
              Chia sẻ & Pass đồ.
            </h2>
            <p className="text-[#707070] text-lg">Tìm nguồn cảm hứng mới. Chuyển nhượng đồ ít mặc dễ dàng chỉ với một nút bấm.</p>
          </div>
        </div>
      </section>

      {/* NEW COMPONENT 1: Social Proof */}
      <section className="social-proof-section w-full py-24 px-6 bg-[#1A1A1A] relative z-10 border-t border-[#1A1A1A]/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="font-heading text-5xl md:text-6xl text-white font-medium metric-number" data-target="10000" data-suffix="+">0</div>
            <div className="text-sm uppercase tracking-widest text-[#707070] mt-2">Outfits AI gợi ý</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-heading text-5xl md:text-6xl text-white font-medium metric-number" data-target="5000" data-suffix="+">0</div>
            <div className="text-sm uppercase tracking-widest text-[#707070] mt-2">Tủ đồ số hóa</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-heading text-5xl md:text-6xl text-white font-medium metric-number" data-target="98" data-suffix="%">0</div>
            <div className="text-sm uppercase tracking-widest text-[#707070] mt-2">Tiết kiệm thời gian</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-heading text-5xl md:text-6xl text-white font-medium metric-number" data-target="30" data-suffix="s">0</div>
            <div className="text-sm uppercase tracking-widest text-[#707070] mt-2">Upload xong</div>
          </div>
        </div>
      </section>

      {/* NEW COMPONENT 2: Before/After */}
      <section className="before-after-section w-full py-32 px-6 bg-[#F4F1EE] relative z-10">
        <h2 className="font-heading text-4xl md:text-6xl text-center text-[#1A1A1A] mb-16 font-medium">Trước & Sau khi có Closy</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

          {/* Before Card */}
          <div className="before-card bg-white rounded-3xl p-10 border border-[#1A1A1A]/5 shadow-sm opacity-0">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-8">Trước Closy</h3>
            <ul className="space-y-6">
              <li className="before-item flex items-center gap-4 opacity-0 text-[#707070]">
                <Clock className="size-6 shrink-0 text-[#1A1A1A]" />
                <span className="text-lg">30 phút mỗi sáng để chọn đồ</span>
              </li>
              <li className="before-item flex items-center gap-4 opacity-0 text-[#707070]">
                <Shirt className="size-6 shrink-0 text-[#1A1A1A]" />
                <span className="text-lg">Tủ đồ lộn xộn, quần áo xếp chồng</span>
              </li>
              <li className="before-item flex items-center gap-4 opacity-0 text-[#707070]">
                <AlertCircle className="size-6 shrink-0 text-[#1A1A1A]" />
                <span className="text-lg">Mua trùng đồ cũ, phối đồ không hợp</span>
              </li>
            </ul>
          </div>

          {/* After Card */}
          <div className="after-card bg-[#1A1A1A] rounded-3xl p-10 text-white shadow-xl opacity-0">
            <h3 className="text-2xl font-bold text-white mb-8">Sau Closy</h3>
            <ul className="space-y-6">
              <li className="after-item flex items-center gap-4 opacity-0">
                <Sparkles className="size-6 shrink-0 text-[#B8975A]" />
                <span className="text-lg">2 phút có ngay outfit hoàn hảo</span>
              </li>
              <li className="after-item flex items-center gap-4 opacity-0">
                <Smartphone className="size-6 shrink-0 text-[#B8975A]" />
                <span className="text-lg">Quản lý tủ đồ gọn gàng trên app</span>
              </li>
              <li className="after-item flex items-center gap-4 opacity-0">
                <Target className="size-6 shrink-0 text-[#B8975A]" />
                <span className="text-lg">AI thấu hiểu gu thẩm mỹ của bạn</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* NEW COMPONENT 3: Testimonials */}
      <section className="testimonials-section w-full py-32 px-6 bg-[#EBE7E2] relative z-10">
        <h2 className="font-heading text-4xl md:text-6xl text-center text-[#1A1A1A] mb-16 font-medium">Gen Z nói gì về Closy?</h2>
        <div className="max-w-3xl mx-auto space-y-8 flex flex-col">

          <div className="flex justify-start">
            <div className="testimonial-bubble opacity-0 bg-white rounded-2xl p-6 shadow-lg max-w-md border border-[#1A1A1A]/5 flex items-start gap-4">
              <div className="size-10 rounded-full bg-[#D9C5B2] flex items-center justify-center shrink-0 font-bold text-white text-sm">LF</div>
              <div>
                <div className="text-sm font-bold text-[#1A1A1A]">@linh.fashion</div>
                <div className="text-[#707070] text-base mt-2 italic">"Không nghĩ AI phối đồ giỏi vậy luôn 😳 Mặc đẹp mà không cần nghĩ"</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="testimonial-bubble opacity-0 bg-white rounded-2xl p-6 shadow-lg max-w-md border border-[#1A1A1A]/5 flex items-start gap-4">
              <div className="size-10 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0 font-bold text-white text-sm">MC</div>
              <div>
                <div className="text-sm font-bold text-[#1A1A1A]">@minh.closet</div>
                <div className="text-[#707070] text-base mt-2 italic">"Pass được mấy cái áo không mặc 2 năm rồi, vui quá! ❤️"</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="testimonial-bubble opacity-0 bg-white rounded-2xl p-6 shadow-lg max-w-md border border-[#1A1A1A]/5 flex items-start gap-4">
              <div className="size-10 rounded-full bg-[#B8975A] flex items-center justify-center shrink-0 font-bold text-white text-sm">AS</div>
              <div>
                <div className="text-sm font-bold text-[#1A1A1A]">@an.style99</div>
                <div className="text-[#707070] text-base mt-2 italic">"Giờ mỗi sáng mở app là có outfit luôn, tiết kiệm cả tiếng đồng hồ 🔥"</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW COMPONENT 4: Final CTA */}
      <section className="final-cta-section w-full min-h-[70vh] flex items-center justify-center px-6 bg-[#1A1A1A] relative overflow-hidden z-10">
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,_#D9C5B2_0%,_transparent_70%)] rounded-full opacity-20 z-0 pointer-events-none mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight font-medium">
            <div className="cta-heading-line opacity-0">Sẵn sàng để không bao giờ hỏi</div>
            <div className="cta-heading-line opacity-0 mt-2"><span className="text-[#D9C5B2] italic">"Hôm nay mặc gì?"</span> nữa?</div>
          </h2>
          <p className="text-[#707070] text-lg mt-6 cta-heading-line opacity-0">Không cần thẻ tín dụng. 30 giây.</p>

          <Link href="/auth/register" className="cta-button opacity-0 mt-10">
            <Button className="bg-white text-[#1A1A1A] rounded-full px-12 py-7 text-lg font-bold hover:scale-[1.03] shadow-[0_0_40px_rgba(217,197,178,0.3)] hover:bg-white transition-all duration-300">
              Bắt Đầu Miễn Phí →
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#1A1A1A] border-t border-white/10 text-[#707070] py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-heading text-2xl font-bold text-white">Closy.</div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-[#D9C5B2] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#D9C5B2] transition-colors">TikTok</a>
            <a href="#" className="hover:text-[#D9C5B2] transition-colors">Chính sách</a>
          </div>
          <p className="text-sm">© 2026 Closy. Built for Gen Z.</p>
        </div>
      </footer>
    </div>
  );
}

// Helpers
function ClothCard({ src, className }: { src: string, className?: string }) {
  return (
    <div className={cn("absolute size-40 md:size-48 bg-white/60 backdrop-blur-md rounded-2xl border border-white p-4 shadow-xl flex items-center justify-center", className)}>
      <Image src={src} alt="Cloth" fill className="object-contain p-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]" />
    </div>
  )
}

function FeedCard({ src, className, likes, user }: { src: string, className?: string, likes: string, user: string }) {
  return (
    <div className={cn("absolute w-56 md:w-64 bg-white p-3 rounded-2xl shadow-2xl", className)}>
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3">
        <Image src={src} alt="Feed" fill className="object-cover" />
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-black font-bold text-sm">{user}</span>
        <div className="flex items-center gap-1 text-black/60">
          <Heart className="size-4" />
          <span className="text-xs font-bold">{likes}</span>
        </div>
      </div>
    </div>
  )
}
