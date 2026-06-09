/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowDown, Check, Heart, MessageCircle, Share2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LandingClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Main Scrollytelling Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrolly-container",
        start: "top top",
        end: "+=12000", // Stretch out the scroll distance to force slower progression
        scrub: 2.5, // Add more inertia (2.5 seconds to catch up) so it feels heavier and smoother
        pin: true,
      }
    });

    // SCENE 0: Hero -> Start
    tl.to(".hero-content", { opacity: 0, y: -50, duration: 1 })
      .to(".wardrobe-container", { scale: 1, y: "10vh", duration: 1.5, ease: "power2.inOut" }, "<")

    // SCENE 1: Cuộn 1 - Digital Wardrobe
    // Image Sequence synchronized with Scan Line
    tl.add("wardrobe-scan")
      // Scan line sweeps down (duration 1.5s)
      .fromTo(".scan-line", { top: "0%", opacity: 0 }, { top: "100%", opacity: 1, duration: 1.5, ease: "power1.inOut" }, "wardrobe-scan")
      // At 50% of the scan (0.75s), show frame 2 (hé mở)
      .to(".wardrobe-frame-2", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=0.55")
      // At roughly 100% of the scan (1.4s), show frame 3 (mở to)
      .to(".wardrobe-frame-3", { opacity: 1, duration: 0.1 }, "wardrobe-scan+=1")
      .to(".scan-line", { opacity: 0, duration: 0.2 })
      // Move wardrobe slightly to the left
      .to(".wardrobe-container", { x: "-25vw", scale: 0.8, opacity: 0.8, duration: 1.5, ease: "power2.inOut" })
      // Clothes fly out from wardrobe
      .fromTo(".cloth-card",
        { scale: 0, opacity: 0, x: "-25vw", y: "10vh", rotation: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          x: (i) => `${(i % 3) * 12 + 5}vw`, // Spread to the right
          y: (i) => `${Math.floor(i / 3) * 15 - 5}vh`,
          rotation: (i) => (i % 2 === 0 ? Math.random() * 10 : -Math.random() * 10),
          duration: 1.5,
          ease: "back.out(1.2)"
        },
        "<0.5"
      )
      .fromTo(".copy-1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // SCENE 2: Cuộn 2 - AI Recommendation
    tl.to(".copy-1", { opacity: 0, y: -50, duration: 0.5 })
      .to(".cloth-card:not(.outfit-item)", { scale: 0, opacity: 0, stagger: 0.05, duration: 0.5 }) // Hide non-outfit items
      // Assemble Outfit
      .to(".outfit-top", { x: "10vw", y: "-20vh", rotation: 0, scale: 1.2, duration: 1.5, ease: "power3.inOut", zIndex: 30 }, "<")
      .to(".outfit-bottom", { x: "10vw", y: "15vh", rotation: 0, scale: 1.2, duration: 1.5, ease: "power3.inOut", zIndex: 20 }, "<")
      .to(".outfit-shoes", { x: "10vw", y: "35vh", rotation: 0, scale: 1.1, duration: 1.5, ease: "power3.inOut", zIndex: 10 }, "<")
      .to(".outfit-acc", { x: "25vw", y: "-2vh", rotation: 15, scale: 1, duration: 1.5, ease: "power3.inOut", zIndex: 40 }, "<")
      // Magic glow
      .fromTo(".magic-glow", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.5, duration: 1 }, "<0.5")
      // AI Core Appears in center
      .fromTo(".outfit-ai-core", { scale: 0, opacity: 0, x: "10vw", y: "-2vh" }, { scale: 1, opacity: 1, x: "10vw", y: "-2vh", duration: 1, ease: "back.out(1.5)" }, "<0.2")
      .fromTo(".copy-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // SCENE 3: Cuộn 3 - AI Chatbot
    tl.to(".copy-2", { opacity: 0, y: -50, duration: 0.5 })
      // Move outfit left
      .to(".outfit-group", { x: "-20vw", scale: 0.9, duration: 1.5, ease: "power2.inOut" }, "<")
      // Show Chat
      .fromTo(".chat-interface", { opacity: 0, x: "30vw", y: "0vh", scale: 0.8 }, { opacity: 1, x: "15vw", y: "0vh", scale: 1, duration: 1.5, ease: "back.out(1)" }, "<")
      .fromTo(".chat-bubble-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
      .fromTo(".chat-bubble-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
      .fromTo(".copy-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

    // SCENE 4: Cuộn 4 - Community Feed
    tl.to(".copy-3", { opacity: 0, y: -50, duration: 0.5 })
      .to(".chat-interface", { opacity: 0, x: "40vw", duration: 1 })
      // Outfit ages and moves aside, Robot and glow disappears
      .to(".outfit-ai-core", { opacity: 0, scale: 0, duration: 0.5 }, "<")
      .to(".magic-glow", { opacity: 0, duration: 0.5 }, "<")
      .to(".outfit-group", { opacity: 0.3, scale: 0.6, x: "-35vw", y: "10vh", duration: 1.5 }, "<")
      .to(".time-decay-tag", { opacity: 1, duration: 0.5 }, "<0.5")
      // Feeds appear
      .fromTo(".feed-card-1", { x: "50vw", y: "15vh", opacity: 0, rotation: 10 }, { x: "-5vw", y: "-5vh", opacity: 1, rotation: -4, duration: 1.5, ease: "power2.out" }, "<0.2")
      .fromTo(".feed-card-2", { x: "50vw", y: "-10vh", opacity: 0, rotation: -10 }, { x: "15vw", y: "-15vh", opacity: 1, rotation: 6, duration: 1.5, ease: "power2.out" }, "<0.2")
      .fromTo(".feed-card-3", { x: "50vw", y: "30vh", opacity: 0, rotation: 15 }, { x: "10vw", y: "20vh", opacity: 1, rotation: -2, duration: 1.5, ease: "power2.out" }, "<0.2")
      // Like bubbles
      .fromTo(".like-bubble", { y: "10vh", opacity: 0, scale: 0 }, { y: "-30vh", opacity: 1, scale: 1.5, stagger: 0.15, duration: 1.5, ease: "power1.out" }, "<0.5")
      .fromTo(".copy-4", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#F4F1EE] text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-[#D9C5B2] selection:text-white">
      
      {/* 1. SCROLLYTELLING CONTAINER */}
      <section className="scrolly-container relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFFFFF] to-[#F4F1EE] z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 mix-blend-multiply pointer-events-none" />

        {/* HERO CONTENT (Scene 0) */}
        <div className="hero-content absolute z-50 flex flex-col items-center text-center gap-6 mt-32">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-[9rem] font-medium tracking-tighter text-[#1A1A1A] leading-[0.9]">
            Tủ đầy ắp đồ,<br />nhưng lại...
          </h1>
          <h2 className="font-heading text-4xl md:text-6xl text-[#D9C5B2] italic pr-8">
            "Hôm nay mặc gì?"
          </h2>
          <div className="mt-12 flex flex-col items-center gap-3 animate-bounce">
            <span className="text-xs font-medium uppercase tracking-widest text-[#707070]">Cuộn để mở khóa tủ đồ</span>
            <ArrowDown className="size-5 text-[#D9C5B2]" />
          </div>
        </div>

        {/* CENTRAL WARDROBE (Scene 0 -> Scene 1) */}
        <div className="wardrobe-container absolute z-20 scale-[1.5] translate-y-[40vh] flex justify-center items-center h-[500px] w-[400px]">
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
              src="/landing-page/wardrobe-door-2.png" 
              alt="Wardrobe Frame 2" 
              fill 
              className="wardrobe-frame-2 object-contain opacity-0 z-20"
            />
            {/* Frame 3 */}
            <Image 
              src="/landing-page/wardrobe-door-3.png" 
              alt="Wardrobe Frame 3" 
              fill 
              className="wardrobe-frame-3 object-contain opacity-0 z-30"
            />
            {/* Scan Line Effect */}
            <div className="scan-line absolute left-0 w-full h-1 bg-[#D9C5B2] shadow-[0_0_20px_5px_rgba(217,197,178,0.5)] z-20 opacity-0 rounded-full" />
          </div>
        </div>

        {/* CLOTHING CARDS (Scattered -> Outfit) */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="outfit-group relative w-full h-full flex items-center justify-center">
            
            {/* Magic Glow for Scene 2 */}
            <div className="magic-glow absolute opacity-0 w-[400px] h-[400px] bg-[#D9C5B2] rounded-full blur-[100px] mix-blend-multiply -z-10 translate-x-[15vw]" />
            <div className="time-decay-tag absolute opacity-0 bg-white/80 backdrop-blur-md border border-black/10 text-black/50 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest z-50 -translate-y-24">Last worn: 3 months ago</div>

            {/* Non-Outfit Items (Hide later) */}
            <ClothCard src="/landing-page/bottom-2.png" className="cloth-card top-[30vh] left-[45vw]" />
            <ClothCard src="/landing-page/top-2.png" className="cloth-card top-[40vh] left-[50vw]" />

            {/* AI Avatar Core */}
            <div className="outfit-ai-core absolute top-[40vh] left-[51vw] opacity-0 size-28 md:size-52 rounded-full border border-white bg-white overflow-hidden z-25 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <Image src="/landing-page/Robot-AI.png" alt="AI Core" fill className="object-cover p-3" />
            </div>

            {/* Outfit Items */}
            <ClothCard src="/landing-page/top-1.png" className="cloth-card outfit-item outfit-top top-[20vh] left-[55vw]" />
            <ClothCard src="/landing-page/bottom-1.png" className="cloth-card outfit-item outfit-bottom top-[50vh] left-[40vw]" />
            <ClothCard src="/landing-page/shoe-1.png" className="cloth-card outfit-item outfit-shoes top-[70vh] left-[60vw]" />
            <ClothCard src="/landing-page/acc-1.png" className="cloth-card outfit-item outfit-acc top-[35vh] left-[65vw]" />
          </div>
        </div>

        {/* CHAT INTERFACE (Scene 3) */}
        <div className="chat-interface absolute z-40 opacity-0 w-[350px] p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1A1A1A]/5">
            <div className="relative size-12 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#1A1A1A]/10 shadow-sm">
              <Image src="/landing-page/Robot-AI.png" alt="AI" fill className="object-cover p-1" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-[#1A1A1A]">Closy AI</h4>
              <p className="text-xs text-[#D9C5B2] uppercase tracking-widest font-bold">Stylist Cá Nhân</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="chat-bubble-1 opacity-0 bg-[#F4F1EE] text-[#1A1A1A] text-sm p-4 rounded-2xl rounded-tl-sm w-[90%] border border-[#1A1A1A]/5">
              Thứ 7 này đi dạo phố mặc gì?
            </div>
            <div className="chat-bubble-2 opacity-0 bg-[#D9C5B2] text-white text-sm p-4 rounded-2xl rounded-tr-sm w-[95%] ml-auto shadow-md">
              Thử set này nhé: Thun basic và Jeans ống rộng cực thoải mái!
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

        {/* COPY TEXTS (Right/Bottom Side) */}
        <div className="absolute bottom-20 left-10 md:left-20 z-50 max-w-xl text-left pointer-events-none">
          <div className="copy-1 opacity-0 absolute bottom-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <Sparkles className="size-3" /> Digital Wardrobe
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight">
              Số hoá tủ đồ.
            </h2>
            <p className="text-[#707070] text-lg">Chụp 1 lần. AI tự động bóc tách nền, phân loại màu sắc và chất liệu.</p>
          </div>

          <div className="copy-2 opacity-0 absolute bottom-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <Check className="size-3" /> AI Recommendation
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight">
              Stylist Cá Nhân.
            </h2>
            <p className="text-[#707070] text-lg">Hàng ngàn gợi ý phối đồ từ chính tủ đồ của bạn. Đổi món cực nhanh chỉ với 1 chạm.</p>
          </div>

          <div className="copy-3 opacity-0 absolute bottom-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <MessageCircle className="size-3" /> AI Chatbot
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight">
              Hiểu gu của bạn.
            </h2>
            <p className="text-[#707070] text-lg">Closy phân tích thời tiết, hoàn cảnh và thấu hiểu phong cách riêng để tư vấn mỗi ngày.</p>
          </div>

          <div className="copy-4 opacity-0 absolute bottom-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-4 shadow-sm">
              <Share2 className="size-3" /> Community
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-4 leading-tight">
              Chia sẻ & Pass đồ.
            </h2>
            <p className="text-[#707070] text-lg">Tìm nguồn cảm hứng mới. Chuyển nhượng đồ ít mặc dễ dàng chỉ với một nút bấm.</p>
          </div>
        </div>
      </section>

      {/* 2. PRICING & CTA SECTION (Scroll 6) */}
      <section className="w-full py-32 px-6 bg-[#EBE7E2] relative z-10 border-t border-[#1A1A1A]/5">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D9C5B2] rounded-full blur-[150px] opacity-20 pointer-events-none" />
            <h2 className="font-heading text-5xl md:text-7xl font-medium text-[#1A1A1A] mb-6 relative z-10">Mở khóa Tủ đồ của bạn.</h2>
            <p className="text-[#707070] text-xl max-w-2xl mx-auto relative z-10">
              Trải nghiệm thời trang thông minh hoàn toàn miễn phí, hoặc nâng cấp để không giới hạn sự sáng tạo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
            {/* Free Tier */}
            <div className="bg-white rounded-[2rem] p-10 border border-[#1A1A1A]/5 flex flex-col hover:border-[#1A1A1A]/10 transition-colors shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Closy Basic</h3>
              <div className="text-5xl font-heading font-medium mb-8">Miễn phí</div>
              
              <ul className="space-y-5 mb-10 flex-1">
                <PricingFeature text="Số hóa tối đa 30 items" />
                <PricingFeature text="3 lượt AI phối đồ mỗi ngày" />
                <PricingFeature text="Tham gia Cộng đồng Pass đồ" />
              </ul>
              <Button variant="outline" className="w-full rounded-full h-14 border-[#1A1A1A]/20 text-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-white transition-all text-base font-bold">
                Bắt Đầu Ngay
              </Button>
            </div>

            {/* Premium Tier */}
            <div className="bg-[#D9C5B2]/20 rounded-[2rem] p-10 border border-[#D9C5B2]/30 flex flex-col relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 bg-[#D9C5B2] text-white text-xs font-bold px-6 py-2 rounded-bl-2xl uppercase tracking-widest">Premium</div>
              <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Closy Pro</h3>
              <div className="text-5xl font-heading font-medium mb-8 text-[#1A1A1A]">99k<span className="text-xl font-sans text-[#707070]"> / tháng</span></div>
              
              <ul className="space-y-5 mb-10 flex-1">
                <PricingFeature text="Không giới hạn items tủ đồ" highlighted />
                <PricingFeature text="Không giới hạn AI phối đồ & Chat" highlighted />
                <PricingFeature text="Phân tích Cost-per-wear chi tiết" />
                <PricingFeature text="Ưu tiên hiển thị trên Chợ đồ cũ" />
              </ul>
              <Button className="w-full rounded-full h-14 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 font-bold transition-all text-base hover:scale-[1.02]">
                Nâng Cấp Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#EBE7E2] border-t border-[#1A1A1A]/5 text-[#707070] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-heading text-2xl font-bold text-[#1A1A1A]">Closy.</div>
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
    <div className={cn("absolute w-56 md:w-64 bg-white p-3 rounded-2xl shadow-2xl rotate-3", className)}>
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

function PricingFeature({ text, highlighted = false }: { text: string, highlighted?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <div className={cn("mt-1 size-5 rounded-full flex items-center justify-center shrink-0", highlighted ? "bg-[#B8975A] text-black" : "bg-white/10 text-white")}>
        <Check className="size-3 stroke-[3]" />
      </div>
      <span className={highlighted ? "text-white font-medium" : "text-[#A09C96]"}>{text}</span>
    </li>
  );
}
