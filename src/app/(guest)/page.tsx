"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ScanLine, Tag, Check, ArrowRight, Wind, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Kỷ Nguyên Phong Cách Mới",
    title: "Nâng Tầm\nPhong Cách.",
    desc: "Định hình lại cách bạn ăn mặc với trí tuệ nhân tạo.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000",
    cta: "Bắt Đầu Ngay",
    link: "/auth/register"
  },
  {
    id: 2,
    badge: "Xu Hướng Mới Nhất",
    title: "Bộ Sưu Tập\nMùa Hè '26.",
    desc: "Đón đầu xu hướng thời trang Hè với chất liệu Linen thoáng mát và tone màu Pastel.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000",
    cta: "Khám Phá Ngay",
    link: "#"
  },
  {
    id: 3,
    badge: "Thời Trang Bền Vững",
    title: "Tái Sinh\nVòng Đời.",
    desc: "Ký gửi thời trang, mua bán đồ cũ trực tiếp từ tủ đồ số của bạn.",
    image: "https://images.unsplash.com/photo-1542272604-780c4050d153?auto=format&fit=crop&q=80&w=2000",
    cta: "Xem Chợ Đồ Cũ",
    link: "#"
  }
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full bg-[#FAF7F2] overflow-x-hidden font-sans">
      
      {/* 1. EDITORIAL HERO SECTION CAROUSEL */}
      <section className="relative w-full h-[100vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        
        {/* Animated Backgrounds */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ y: heroY }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-multiply"
              style={{ backgroundImage: `url(${slide.image})` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/40 via-transparent to-[#FAF7F2]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8 pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm text-sm font-medium text-ink uppercase tracking-widest">
                <Sparkles className="size-4" />
                <span>{slide.badge}</span>
              </div>
              
              <h1 className="font-heading text-6xl md:text-8xl lg:text-[10rem] font-medium tracking-tighter text-ink leading-[0.85] whitespace-pre-line">
                {slide.title}
              </h1>
              
              <p className="text-lg md:text-xl text-ink-muted max-w-xl text-balance font-medium mt-4">
                {slide.desc}
              </p>

              <div className="flex gap-4 mt-6">
                <Link href={slide.link}>
                  <Button size="lg" className="rounded-none bg-ink text-cream hover:bg-ink/90 px-8 h-14 font-medium uppercase tracking-widest text-xs transition-transform active:scale-95">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Weather Card (Static) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2, type: "spring" }}
          className="hidden md:flex absolute left-12 top-1/3 flex-col gap-2 p-4 bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl z-20 pointer-events-none"
        >
          <div className="flex items-center gap-3 text-ink">
            <Sun className="size-8 stroke-[1.5]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Hà Nội</p>
              <p className="text-xl font-heading font-medium">24°C</p>
            </div>
          </div>
          <p className="text-xs font-medium max-w-[140px] mt-2 opacity-80">Thời tiết hoàn hảo cho outfit hôm nay.</p>
        </motion.div>

        {/* Carousel Controls & Progress */}
        <div className="absolute bottom-12 left-0 w-full px-12 flex flex-col md:flex-row justify-between items-center z-20 gap-6">
          
          {/* Progress Bars */}
          <div className="flex gap-2 w-full md:max-w-xs">
            {HERO_SLIDES.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentSlide(index)}
                className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden relative"
              >
                {currentSlide === index && (
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-ink"
                  />
                )}
                {currentSlide > index && (
                  <div className="absolute top-0 left-0 h-full w-full bg-ink/40" />
                )}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-transparent border-ink/20 text-ink hover:bg-ink hover:text-white"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-transparent border-ink/20 text-ink hover:bg-ink hover:text-white"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 2. AI MIX & MATCH ANIMATION */}
      <section className="w-full py-32 px-6 bg-white relative z-10 border-y border-ink/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="font-heading text-4xl md:text-6xl font-medium tracking-tight text-ink leading-tight">
              Stylist Riêng<br />Của Bạn.
            </h2>
            <p className="text-lg text-ink-muted leading-relaxed max-w-md">
              Không còn tốn hàng giờ đứng trước tủ đồ. AI của chúng tôi thấu hiểu phong cách, thời tiết và hoàn cảnh để mix & match cho bạn bộ trang phục hoàn hảo nhất trong tích tắc.
            </p>
          </div>
          
          <div className="flex-1 w-full flex justify-center items-center h-[500px] relative">
            {/* Base Silhouette */}
            <div className="absolute w-[200px] h-[400px] bg-ink/5 rounded-full blur-xl" />
            
            {/* Animated Clothing Items */}
            <motion.div 
              initial={{ y: -50, opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute top-10 z-20 w-48 aspect-square bg-white shadow-2xl rounded-xl p-2 border border-ink/10"
            >
              <img src="https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=300&q=80" alt="Shirt" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            <motion.div 
              initial={{ x: -50, opacity: 0, scale: 0.9, rotate: 5 }}
              whileInView={{ x: -60, y: 150, opacity: 1, scale: 1, rotate: -10 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute z-10 w-40 aspect-[3/4] bg-white shadow-2xl rounded-xl p-2 border border-ink/10"
            >
              <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&q=80" alt="Pants" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0, scale: 0.9, rotate: 15 }}
              whileInView={{ x: 80, y: 220, opacity: 1, scale: 1, rotate: 5 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute z-30 w-32 aspect-square bg-white shadow-xl rounded-xl p-2 border border-ink/10"
            >
              <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&q=80" alt="Shoes" className="w-full h-full object-cover rounded-lg" />
            </motion.div>
            
            {/* UI Overlay */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1, type: "spring" }}
              viewport={{ once: true }}
              className="absolute bottom-10 bg-ink text-cream px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-40"
            >
              <Check className="size-5 text-primary" />
              <span className="font-bold text-sm uppercase tracking-widest">Outfit Hoàn Mỹ</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FASHION BENTO GRID */}
      <section className="w-full py-32 px-6 bg-[#FAF7F2] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-ink mb-4">Mọi Thứ Bạn Cần.</h2>
            <p className="text-ink-muted text-lg max-w-xl mx-auto">Hệ sinh thái thời trang trọn vẹn ngay trong tay bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento 1: Wardrobe (Span 2 cols) */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 relative rounded-3xl overflow-hidden group bg-ink text-white"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550614000-4b95d415d18a?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <div className="size-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                  <ScanLine className="size-6 text-white" />
                </div>
                <h3 className="text-3xl font-heading font-bold mb-2">Số Hóa Tủ Đồ</h3>
                <p className="text-white/70 max-w-md">Chụp ảnh và AI tự động phân loại, xóa nền, gán tag màu sắc, phong cách chỉ trong 2 giây.</p>
              </div>
            </motion.div>

            {/* Bento 2: Community */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative rounded-3xl overflow-hidden group bg-[#D4C5B9] text-ink"
            >
              <div className="absolute top-8 left-8 right-8 z-10">
                <div className="size-12 rounded-full bg-ink/10 backdrop-blur-md flex items-center justify-center mb-4">
                  <Wind className="size-6 text-ink" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Cộng Đồng</h3>
                <p className="text-ink/70 text-sm">Chia sẻ outfit và lấy cảm hứng từ những người yêu thời trang.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80" alt="Fashion" className="absolute -bottom-10 -right-10 w-48 rounded-xl shadow-2xl group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700" />
            </motion.div>

            {/* Bento 3: Marketplace */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative rounded-3xl overflow-hidden group bg-white text-ink border border-ink/10"
            >
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Chợ Đồ Cũ</h3>
                  <p className="text-ink/60 text-sm">Thanh lý những món đồ không còn mặc trực tiếp từ tủ đồ digital.</p>
                </div>
                <Button variant="outline" className="w-full rounded-full border-ink/20">Khám Phá Ngay</Button>
              </div>
            </motion.div>

            {/* Bento 4: Analytics */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 relative rounded-3xl overflow-hidden group bg-[#E8EDE7] text-ink"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-multiply group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#E8EDE7] via-[#E8EDE7]/80 to-transparent" />
              <div className="absolute top-8 bottom-8 left-8 z-10 flex flex-col justify-center">
                <Tag className="size-8 text-ink mb-4" />
                <h3 className="text-3xl font-heading font-bold mb-2">Phân Tích Thói Quen</h3>
                <p className="text-ink/70 max-w-sm">Nhận báo cáo về màu sắc yêu thích, tần suất mặc đồ và chi phí thời trang (Cost per wear).</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. NUMBERS THAT SPEAK */}
      <section className="w-full py-24 px-6 bg-white border-y border-ink/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-ink/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center pt-8 md:pt-0"
            >
              <h3 className="text-5xl md:text-7xl font-heading font-medium text-primary mb-4">100K+</h3>
              <p className="text-ink-muted font-medium uppercase tracking-widest text-xs">Outfits Đã Tạo</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center pt-8 md:pt-0"
            >
              <h3 className="text-5xl md:text-7xl font-heading font-medium text-ink mb-4">50K+</h3>
              <p className="text-ink-muted font-medium uppercase tracking-widest text-xs">Items Được Số Hóa</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center pt-8 md:pt-0"
            >
              <h3 className="text-5xl md:text-7xl font-heading font-medium text-ink mb-4">2 Giờ</h3>
              <p className="text-ink-muted font-medium uppercase tracking-widest text-xs">Tiết Kiệm Mỗi Tuần</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. BRAND MARQUEE (SOCIAL PROOF) */}
      <section className="w-full py-16 bg-[#FAF7F2] overflow-hidden flex flex-col items-center justify-center border-b border-ink/5">
        <p className="text-xs font-medium text-ink-muted uppercase tracking-widest mb-8">AI nhận diện hoàn hảo hàng ngàn thương hiệu</p>
        <div className="relative flex overflow-x-hidden group w-full">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32 py-4">
            {["ZARA", "H&M", "UNIQLO", "MANGO", "LEVI'S", "CALVIN KLEIN", "GUCCI", "BALENCIAGA", "NIKE", "ADIDAS"].map((brand, i) => (
              <span key={i} className="text-3xl md:text-5xl font-heading font-bold text-ink/20 hover:text-ink/60 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
          {/* Duplicate for infinite effect */}
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 md:gap-32 py-4 ml-[100%] md:ml-[100%]">
            {["ZARA", "H&M", "UNIQLO", "MANGO", "LEVI'S", "CALVIN KLEIN", "GUCCI", "BALENCIAGA", "NIKE", "ADIDAS"].map((brand, i) => (
              <span key={`dup-${i}`} className="text-3xl md:text-5xl font-heading font-bold text-ink/20 hover:text-ink/60 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="w-full bg-ink text-cream py-32 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Gói Dịch Vụ</h2>
            <p className="text-ink-subtle text-lg max-w-lg mx-auto">
              Sử dụng miễn phí trọn đời, hoặc nâng cấp Premium để trải nghiệm không giới hạn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 w-full">
            {/* Free Tier */}
            <div className="bg-ink rounded-3xl p-8 border border-white/10 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-heading font-bold mb-6">Miễn phí<span className="text-lg font-sans text-ink-subtle font-normal"> / mãi mãi</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Tối đa 20 items trong tủ đồ" />
                <PricingFeature text="3 lượt gợi ý AI mỗi ngày" />
                <PricingFeature text="Lưu trữ tối đa 20 outfits" />
                <PricingFeature text="3 tin nhắn với Stylist AI / ngày" />
              </ul>
              <Button variant="outline" className="w-full rounded-full h-12 border-white/20 text-ink bg-white hover:bg-white/90">
                Đăng ký Free
              </Button>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-b from-[#B8975A]/20 to-transparent rounded-3xl p-8 border border-[#B8975A]/50 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#B8975A] text-ink text-xs font-bold px-4 py-1 rounded-bl-xl">PHỔ BIẾN</div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Sparkles className="size-5 text-[#B8975A]" /> Premium</h3>
              <div className="text-4xl font-heading font-bold mb-6">99.000đ<span className="text-lg font-sans text-ink-subtle font-normal"> / tháng</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Không giới hạn items tủ đồ" highlighted />
                <PricingFeature text="15 lượt gợi ý AI mỗi ngày" />
                <PricingFeature text="Lưu trữ outfits không giới hạn" />
                <PricingFeature text="15 tin nhắn với Stylist AI / ngày" />
                <PricingFeature text="Ưu tiên hỗ trợ, tính năng mới" />
              </ul>
              <Button className="w-full rounded-full h-12 bg-[#B8975A] text-ink hover:bg-[#B8975A]/90 font-bold shadow-lg shadow-[#B8975A]/20">
                Nâng cấp Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-ink border-t border-white/10 text-white/60 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-heading text-2xl font-bold text-white tracking-tight">Smart Wardrobe</h3>
            <p className="max-w-sm text-sm leading-relaxed">
              Tủ đồ thông minh thế hệ mới tích hợp AI Stylist. Số hóa, quản lý và phối đồ mỗi ngày chưa bao giờ dễ dàng và đầy cảm hứng đến thế.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Sản phẩm</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Tính năng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bảng giá</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tải ứng dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cộng đồng</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Công ty</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Smart Wardrobe. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
      `}} />
    </div>
  );
}


function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="size-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
        <Icon className="size-6 stroke-[1.5]" />
      </div>
      <h3 className="font-heading text-2xl font-bold text-ink">{title}</h3>
      <p className="text-ink-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingFeature({ text, highlighted = false }: { text: string, highlighted?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <div className={cn("mt-1 size-5 rounded-full flex items-center justify-center shrink-0", highlighted ? "bg-[#B8975A] text-ink" : "bg-white/10 text-white")}>
        <Check className="size-3 stroke-[3]" />
      </div>
      <span className={highlighted ? "text-white font-medium" : "text-white/80"}>{text}</span>
    </li>
  );
}

