/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowDown, Check, Heart, MessageCircle, Share2,
  Smartphone, Target,
} from "lucide-react";

// Extracted components & data
import { ClothCard } from "./cards/ClothCard";
import { FeedCard } from "./cards/FeedCard";
import { SoftAurora } from "./backgrounds/SoftAurora";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { FAQSection } from "./sections/FAQSection";
import { useScrollytelling } from "./hooks/useScrollytelling";
import {
  METRICS, BEFORE_ITEMS, AFTER_ITEMS, TESTIMONIALS,
  FEED_CARDS, NON_OUTFIT_CARDS, OUTFIT_CARDS,
} from "./data/landing-data";

export function LandingClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  // All GSAP animations in custom hook (mobile-aware + a11y)
  useScrollytelling(containerRef);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#F4F1EE] text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-[#D9C5B2] selection:text-white"
    >
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Scroll Progress */}
      <ScrollProgressBar />

      {/* ═══════════════════════════════════════════════════════
          1. SCROLLYTELLING CONTAINER
          ═══════════════════════════════════════════════════════ */}
      <section
        className="scrolly-container relative w-full h-dvh flex items-center justify-center overflow-hidden"
        role="region"
        aria-label="Giới thiệu tính năng Closy"
      >
        {/* Background Layers */}
        <div className="bg-gradient-layer absolute inset-0 z-0 bg-[#F4F1EE]" />

        {/* Ambient Blobs */}
        <div className="ambient-blob-1 absolute top-[10%] left-[15%] w-[350px] h-[350px] md:w-[700px] md:h-[700px] rounded-full bg-[radial-gradient(circle,_#D9C5B2_0%,_transparent_70%)] opacity-[0.12] z-[1] pointer-events-none" aria-hidden="true" />
        <div className="ambient-blob-2 absolute top-[40%] right-[10%] w-[350px] h-[350px] md:w-[700px] md:h-[700px] rounded-full bg-[radial-gradient(circle,_#E8DFD4_0%,_transparent_70%)] opacity-[0.12] z-[1] pointer-events-none" aria-hidden="true" />
        <div className="ambient-blob-3 absolute top-[70%] left-[40%] w-[350px] h-[350px] md:w-[700px] md:h-[700px] rounded-full bg-[radial-gradient(circle,_#D4DECE_0%,_transparent_70%)] opacity-[0.12] z-[1] pointer-events-none" aria-hidden="true" />

        {/* ── HERO CONTENT (Scene 0) ── */}
        <div className="hero-content absolute left-[5vw] md:left-[5vw] top-1/2 -translate-y-1/2 text-left z-50 flex flex-col items-start gap-2 max-w-[90vw] md:max-w-[50vw]">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-[#1A1A1A] leading-[0.9]">
            Tủ đầy ắp đồ,<br />nhưng lại...
          </h1>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl text-[#D9C5B2] italic mt-4">
            "Hôm nay mặc gì?"
          </h2>
        </div>

        <div className="hero-cta absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-[#707070]">
            Cuộn để mở khóa tủ đồ ↓
          </span>
        </div>

        {/* ── CENTRAL WARDROBE (Scene 0 → Scene 1) ── */}
        <div className="wardrobe-container absolute right-[5vw] md:right-[8vw] top-1/2 -translate-y-1/2 z-20 scale-[0.8] md:scale-[1.2] flex justify-center items-center h-[300px] w-[300px] md:h-[600px] md:w-[600px]">
          <div className="relative w-full h-full">
            <Image
              src="/landing-page/wardrobe-closed-1.png"
              alt="Tủ quần áo đóng kín"
              fill
              className="wardrobe-frame-1 object-contain z-10"
              sizes="(max-width: 768px) 300px, 600px"
              priority
            />
            <Image
              src="/landing-page/wardrobe-closed-2.png"
              alt="Tủ quần áo hé mở"
              fill
              className="wardrobe-frame-2 object-contain opacity-0 z-20"
              sizes="(max-width: 768px) 300px, 600px"
            />
            <Image
              src="/landing-page/wardrobe-closed-3.png"
              alt="Tủ quần áo mở hoàn toàn"
              fill
              className="wardrobe-frame-3 object-contain opacity-0 z-30"
              sizes="(max-width: 768px) 300px, 600px"
            />
            {/* Scan Line Effect */}
            <div className="scan-line absolute top-0 left-[15%] w-[70%] md:left-25 md:w-[400px] h-1 bg-[#f5b158] shadow-[0_0_20px_5px_rgba(217,197,178,0.5)] z-20 opacity-0 rounded-full" />
          </div>
        </div>

        {/* ── CLOTHING CARDS & OUTFIT (Scene 1 & 2) ── */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="outfit-group relative w-full h-full flex items-center justify-center">
            {/* Magic Glow for Scene 2 */}
            <div className="magic-glow absolute opacity-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[radial-gradient(circle,_#D9C5B2_0%,_transparent_70%)] mix-blend-multiply -z-10 translate-x-[8vw]" aria-hidden="true" />

            {/* Non-Outfit Items */}
            {NON_OUTFIT_CARDS.map((card) => (
              <ClothCard key={card.src} src={card.src} className={card.className} alt={card.alt} />
            ))}

            {/* AI Avatar Core */}
            <div className="outfit-ai-core absolute top-[40vh] left-[51vw] opacity-0 size-20 md:size-52 rounded-full border border-white bg-white overflow-hidden z-[25] flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <Image
                src="/landing-page/Robot-AI.png"
                alt="Closy AI Stylist Avatar"
                fill
                sizes="(max-width: 768px) 80px, 208px"
                className="object-cover p-2 md:p-3"
              />
            </div>

            {/* Outfit Items */}
            {OUTFIT_CARDS.map((card) => (
              <ClothCard key={card.src} src={card.src} className={card.className} alt={card.alt} />
            ))}
          </div>
        </div>

        {/* ── CHAT INTERFACE (Scene 3) ── */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="chat-interface opacity-0 w-[85vw] sm:w-[70vw] md:w-[380px] p-4 md:p-6 rounded-3xl bg-white/95 border border-white shadow-2xl absolute">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-[#1A1A1A]/5">
              <div className="relative size-10 md:size-12 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#1A1A1A]/10 shadow-sm">
                <Image src="/landing-page/Robot-AI.png" alt="Closy AI" fill sizes="48px" className="object-cover p-1" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base md:text-lg text-[#1A1A1A]">Closy AI</h4>
                <p className="text-[10px] md:text-xs text-[#D9C5B2] uppercase tracking-widest font-bold">Stylist Cá Nhân</p>
              </div>
              <div className="ml-auto flex gap-1 items-center">
                <div className="size-2 rounded-full bg-[#4A8C6E] animate-pulse" />
                <span className="text-[9px] md:text-[10px] text-[#4A8C6E] font-medium">Trực tuyến</span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="chat-bubble-1 opacity-0 bg-[#F4F1EE] text-[#1A1A1A] text-xs md:text-sm p-3 md:p-4 rounded-2xl rounded-tl-sm w-[90%] border border-[#1A1A1A]/5">
                Thứ 7 này đi dạo phố mặc gì?
              </div>
              <div className="chat-bubble-2 opacity-0 bg-[#D9C5B2] text-white text-xs md:text-sm p-3 md:p-4 rounded-2xl rounded-tr-sm w-[95%] ml-auto shadow-md">
                Thử set này nhé: Thun basic và Jeans ống rộng cực thoải mái!
              </div>
              <div className="chat-bubble-3 opacity-0 bg-[#F4F1EE] text-[#1A1A1A] text-xs md:text-sm p-3 md:p-4 rounded-2xl rounded-tl-sm w-[85%] border border-[#1A1A1A]/5">
                Có set nào khác trendy hơn không? 👀
              </div>
            </div>

            <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-2xl bg-[#F4F1EE] border border-[#1A1A1A]/5">
              <div className="flex-1 text-[10px] md:text-xs text-[#A3A3A3]">Nhập tin nhắn...</div>
              <div className="size-7 md:size-8 rounded-full bg-[#D9C5B2] flex items-center justify-center" aria-label="Gửi tin nhắn">
                <ArrowDown className="size-3 text-white rotate-[-90deg]" />
              </div>
            </div>
          </div>

          {/* Floating Context Elements */}
          <div className="chat-float-1 absolute opacity-0 top-[15vh] right-[8vw] md:right-[15vw] bg-white/95 rounded-2xl px-4 md:px-5 py-2 md:py-3 shadow-lg border border-white/60 flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">☀️</span>
            <div>
              <div className="text-[10px] md:text-xs font-bold text-[#1A1A1A]">Hôm nay</div>
              <div className="text-[9px] md:text-[10px] text-[#5A5A5A]">32°C — Nắng nhẹ</div>
            </div>
          </div>

          <div className="chat-float-2 absolute opacity-0 bottom-[15vh] right-[8vw] md:right-[12vw] bg-white/95 rounded-2xl p-3 md:p-4 shadow-lg border border-white/60 w-[160px] md:w-[180px]">
            <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#D9C5B2] font-bold mb-2">Gợi ý outfit</div>
            <div className="flex gap-1.5 md:gap-2">
              {["/landing-page/top-1.png", "/landing-page/bottom-1.png", "/landing-page/shoe-1.png"].map((src) => (
                <div key={src} className="relative size-11 md:size-14 rounded-xl bg-[#F4F1EE] overflow-hidden border border-[#1A1A1A]/5">
                  <Image src={src} alt="Outfit suggestion" fill sizes="56px" className="object-contain p-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="chat-float-3 absolute opacity-0 top-[22vh] left-[5vw] md:left-[42vw] flex gap-1.5 md:gap-2">
            <div className="bg-[#1A1A1A] text-white text-[9px] md:text-[10px] px-2.5 md:px-3 py-1 md:py-1.5 rounded-full font-bold shadow-md">Streetwear</div>
            <div className="bg-white/95 text-[#1A1A1A] text-[9px] md:text-[10px] px-2.5 md:px-3 py-1 md:py-1.5 rounded-full font-bold border border-[#1A1A1A]/10 shadow-sm">Casual</div>
          </div>

          <div className="chat-float-4 absolute opacity-0 bottom-[20vh] md:bottom-[25vh] left-[5vw] md:left-[40vw] bg-white/95 rounded-2xl px-4 md:px-5 py-2 md:py-3 shadow-lg border border-white/60 flex items-center gap-2 md:gap-3">
            <div className="size-8 md:size-10 rounded-full bg-[#4A8C6E]/10 flex items-center justify-center">
              <Check className="size-4 md:size-5 text-[#4A8C6E]" />
            </div>
            <div>
              <div className="text-[10px] md:text-xs font-bold text-[#1A1A1A]">Phù hợp 95%</div>
              <div className="text-[9px] md:text-[10px] text-[#5A5A5A]">Với phong cách của bạn</div>
            </div>
          </div>
        </div>

        {/* ── COMMUNITY FEED (Scene 4) ── */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          {FEED_CARDS.map((card) => (
            <FeedCard key={card.className} {...card} />
          ))}

          {/* Floating Likes */}
          <Heart className="like-bubble absolute top-[50vh] left-[40vw] text-red-500 fill-red-500 opacity-0 size-6 md:size-8" aria-hidden="true" />
          <Heart className="like-bubble absolute top-[40vh] left-[60vw] text-red-400 fill-red-400 opacity-0 size-5 md:size-6" aria-hidden="true" />
          <Heart className="like-bubble absolute top-[60vh] left-[55vw] text-red-500 fill-red-500 opacity-0 size-8 md:size-10" aria-hidden="true" />
        </div>

        {/* ── COPY TEXTS (Left Side) ── */}
        <div className="absolute top-[30%] md:top-[38%] left-[5vw] z-50 w-[90vw] md:w-[35vw] md:max-w-[300px] text-left pointer-events-none">
          <CopyBlock className="copy-1" badge={<><Sparkles className="size-3" /> Tủ đồ kỹ thuật số</>} heading="Số hoá tủ đồ." body="Chụp 1 lần. AI tự động bóc tách nền, phân loại màu sắc và chất liệu." />
          <CopyBlock className="copy-2" badge={<><Check className="size-3" /> Gợi ý từ AI</>} heading="Stylist Cá Nhân." body="Hàng ngàn gợi ý phối đồ từ chính tủ đồ của bạn. Đổi món cực nhanh chỉ với 1 chạm." />
          <CopyBlock className="copy-3" badge={<><MessageCircle className="size-3" /> Trợ lý AI</>} heading="Hiểu gu của bạn." body="Closy phân tích thời tiết, hoàn cảnh và thấu hiểu phong cách riêng để tư vấn mỗi ngày." />
          <CopyBlock className="copy-4" badge={<><Share2 className="size-3" /> Cộng đồng</>} heading="Chia sẻ & Pass đồ." body="Tìm nguồn cảm hứng mới. Chuyển nhượng đồ ít mặc dễ dàng chỉ với một nút bấm." />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. HOW IT WORKS
          ═══════════════════════════════════════════════════════ */}
      <HowItWorksSection />

      {/* ═══════════════════════════════════════════════════════
          3. SOCIAL PROOF
          ═══════════════════════════════════════════════════════ */}
      <section
        className="social-proof-section w-full py-20 md:py-24 px-6 bg-[#1A1A1A] relative z-10 overflow-hidden"
        role="region"
        aria-label="Số liệu thống kê"
      >
        <SoftAurora opacity={0.3} />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center relative z-10">
          {METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center">
              <div
                className="font-heading text-4xl sm:text-5xl md:text-6xl text-white font-medium metric-number"
                data-target={metric.target}
                data-suffix={metric.suffix}
              >
                0
              </div>
              <div className="text-[10px] md:text-sm uppercase tracking-widest text-[#707070] mt-2">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. BEFORE / AFTER
          ═══════════════════════════════════════════════════════ */}
      <section
        className="before-after-section w-full py-24 md:py-32 px-6 bg-[#F4F1EE] relative z-10"
        role="region"
        aria-labelledby="before-after-heading"
      >
        <h2 id="before-after-heading" className="font-heading text-3xl sm:text-4xl md:text-6xl text-center text-[#1A1A1A] mb-12 md:mb-16 font-medium">
          Trước & Sau khi có Closy
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Before Card */}
          <div className="before-card bg-white rounded-3xl p-8 md:p-10 border border-[#1A1A1A]/5 shadow-sm opacity-0 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-6 md:mb-8">Trước Closy</h3>
            <ul className="space-y-5 md:space-y-6">
              {BEFORE_ITEMS.map((item, i) => (
                <li key={i} className="before-item flex items-center gap-3 md:gap-4 opacity-0 text-[#5A5A5A]">
                  <item.icon className="size-5 md:size-6 shrink-0 text-[#1A1A1A]" />
                  <span className="text-base md:text-lg">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After Card */}
          <div className="after-card bg-[#1A1A1A] rounded-3xl p-8 md:p-10 text-white shadow-xl opacity-0 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Sau Closy</h3>
            <ul className="space-y-5 md:space-y-6">
              {AFTER_ITEMS.map((item, i) => (
                <li key={i} className="after-item flex items-center gap-3 md:gap-4 opacity-0">
                  <item.icon className="size-5 md:size-6 shrink-0 text-[#B8975A]" />
                  <span className="text-base md:text-lg">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. TESTIMONIALS
          ═══════════════════════════════════════════════════════ */}
      <section
        className="testimonials-section w-full py-24 md:py-32 px-6 bg-[#EBE7E2] relative z-10"
        role="region"
        aria-labelledby="testimonials-heading"
      >
        <h2 id="testimonials-heading" className="font-heading text-3xl sm:text-4xl md:text-6xl text-center text-[#1A1A1A] mb-12 md:mb-16 font-medium">
          Gen Z nói gì về Closy?
        </h2>
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 flex flex-col">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`flex justify-${t.align}`}>
              <div className="testimonial-bubble opacity-0 bg-white rounded-2xl p-5 md:p-6 shadow-lg max-w-md border border-[#1A1A1A]/5 flex items-start gap-3 md:gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div
                  className="size-9 md:size-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-xs md:text-sm"
                  style={{ backgroundColor: t.bgColor }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-[#1A1A1A]">{t.user}</div>
                  <div className="text-[#5A5A5A] text-sm md:text-base mt-1 md:mt-2 italic">{t.quote}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. FAQ
          ═══════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ═══════════════════════════════════════════════════════
          7. FINAL CTA
          ═══════════════════════════════════════════════════════ */}
      <section
        className="final-cta-section w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-6 bg-[#1A1A1A] relative overflow-hidden z-10"
        role="region"
        aria-label="Kêu gọi hành động"
      >
        <SoftAurora opacity={0.35} color1="#D9C5B2" color2="#B8975A" color3="#7A6B5E" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-tight font-medium">
            <div className="cta-heading-line opacity-0">Sẵn sàng để không bao giờ hỏi</div>
            <div className="cta-heading-line opacity-0 mt-2">
              <span className="text-[#D9C5B2] italic">"Hôm nay mặc gì?"</span> nữa?
            </div>
          </h2>
          <p className="text-[#707070] text-base md:text-lg mt-4 md:mt-6 cta-heading-line opacity-0">
            Không cần thẻ tín dụng. 30 giây.
          </p>

          <Link href="/auth/register" className="cta-button opacity-0 mt-8 md:mt-10">
            <Button className="bg-white text-[#1A1A1A] rounded-full px-10 md:px-12 py-6 md:py-7 text-base md:text-lg font-bold hover:scale-[1.03] shadow-[0_0_40px_rgba(217,197,178,0.3)] hover:bg-white transition-all duration-300">
              Bắt Đầu Miễn Phí →
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8. FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#1A1A1A] border-t border-white/10 text-[#707070] py-10 md:py-12 px-6 relative z-10" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-heading text-2xl font-bold text-white">Closy.</div>
          <div className="flex gap-6 md:gap-8 text-sm">
            <a href="#" className="hover:text-[#D9C5B2] transition-colors" aria-label="Instagram">Instagram</a>
            <a href="#" className="hover:text-[#D9C5B2] transition-colors" aria-label="TikTok">TikTok</a>
            <a href="#" className="hover:text-[#D9C5B2] transition-colors" aria-label="Chính sách bảo mật">Chính sách</a>
            <a href="#" className="hover:text-[#D9C5B2] transition-colors" aria-label="Liên hệ">Liên hệ</a>
          </div>
          <p className="text-xs md:text-sm">© 2026 Closy. Built for Gen Z.</p>
        </div>
      </footer>
    </div>
  );
}

// ── CopyBlock helper ──
function CopyBlock({
  className,
  badge,
  heading,
  body,
}: {
  className: string;
  badge: React.ReactNode;
  heading: string;
  body: string;
}) {
  return (
    <div className={`${className} opacity-0 absolute top-0 left-0 w-full`}>
      <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white border border-[#1A1A1A]/10 text-[10px] md:text-xs font-bold text-[#D9C5B2] uppercase tracking-widest mb-3 md:mb-4 shadow-sm">
        {badge}
      </div>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-3 md:mb-4 leading-tight">
        {heading}
      </h2>
      <p className="text-[#5A5A5A] text-base md:text-lg">{body}</p>
    </div>
  );
}
