import {
  Clock, Smartphone, Target, Shirt, AlertCircle, Sparkles,
} from "lucide-react";

// ─── Social Proof Metrics ────────────────────────────────────────
export interface Metric {
  target: number;
  suffix: string;
  label: string;
}

export const METRICS: Metric[] = [
  { target: 10000, suffix: "+", label: "Outfits AI gợi ý" },
  { target: 5000, suffix: "+", label: "Tủ đồ số hóa" },
  { target: 98, suffix: "%", label: "Tiết kiệm thời gian" },
  { target: 30, suffix: "s", label: "Upload xong" },
];

// ─── Before / After ──────────────────────────────────────────────
export interface ComparisonItem {
  icon: typeof Clock;
  text: string;
}

export const BEFORE_ITEMS: ComparisonItem[] = [
  { icon: Clock, text: "30 phút mỗi sáng để chọn đồ" },
  { icon: Shirt, text: "Tủ đồ lộn xộn, quần áo xếp chồng" },
  { icon: AlertCircle, text: "Mua trùng đồ cũ, phối đồ không hợp" },
];

export const AFTER_ITEMS: ComparisonItem[] = [
  { icon: Sparkles, text: "2 phút có  ngay Trang phục hoàn hảo" },
  { icon: Smartphone, text: "Quản lý tủ đồ gọn gàng trên Trang web" },
  { icon: Target, text: "AI thấu hiểu gu thẩm mỹ của bạn" },
];

// ─── Testimonials ────────────────────────────────────────────────
export interface Testimonial {
  initials: string;
  bgColor: string;
  user: string;
  quote: string;
  align: "start" | "end" | "center";
}

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "LF",
    bgColor: "#D9C5B2",
    user: "@linh.fashion",
    quote: "\"Không nghĩ AI phối đồ giỏi vậy luôn 😳 Mặc đẹp mà không cần nghĩ\"",
    align: "start",
  },
  {
    initials: "MC",
    bgColor: "#1A1A1A",
    user: "@minh.closet",
    quote: "\"Pass được mấy cái áo không mặc 2 năm rồi, vui quá! ❤️\"",
    align: "end",
  },
  {
    initials: "AS",
    bgColor: "#B8975A",
    user: "@an.style99",
    quote: "\"Giờ mỗi sáng mở app là có outfit luôn, tiết kiệm cả tiếng đồng hồ 🔥\"",
    align: "center",
  },
];

// ─── Feed Cards ──────────────────────────────────────────────────
export interface FeedData {
  src: string;
  className: string;
  likes: string;
  user: string;
}

export const FEED_CARDS: FeedData[] = [
  { src: "/landing-page/feed-1.png", className: "feed-card-1", likes: "1.2k", user: "@fashionista" },
  { src: "/landing-page/feed-2.png", className: "feed-card-2", likes: "856", user: "@minimalist" },
  { src: "/landing-page/feed-3.png", className: "feed-card-3", likes: "2.4k", user: "@genz.style" },
];

// ─── Cloth Cards ─────────────────────────────────────────────────
export interface ClothData {
  src: string;
  className: string;
  alt: string;
}

export const NON_OUTFIT_CARDS: ClothData[] = [
  { src: "/landing-page/bottom-2.png", className: "cloth-card top-[30vh] left-[45vw]", alt: "Quần jean xanh phụ" },
  { src: "/landing-page/top-2.png", className: "cloth-card top-[40vh] left-[50vw]", alt: "Áo polo phụ" },
];

export const OUTFIT_CARDS: ClothData[] = [
  { src: "/landing-page/top-1.png", className: "cloth-card outfit-item outfit-top top-[25vh] left-[55vw]", alt: "Áo thun basic trắng" },
  { src: "/landing-page/bottom-1.png", className: "cloth-card outfit-item outfit-bottom top-[45vh] left-[40vw]", alt: "Quần jeans ống rộng" },
  { src: "/landing-page/shoe-1.png", className: "cloth-card outfit-item outfit-shoes top-[60vh] left-[60vw]", alt: "Giày sneaker trắng" },
  { src: "/landing-page/acc-1.png", className: "cloth-card outfit-item outfit-acc top-[35vh] left-[65vw]", alt: "Phụ kiện túi xách" },
];

// ─── How It Works ────────────────────────────────────────────────
export interface Step {
  number: string;
  iconSrc: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: "01",
    iconSrc: "/Icon/camera.png",
    title: "Chụp & Úp Ảnh",
    description: "Chụp ảnh tủ đồ, AI tự động bóc tách nền, phân loại màu sắc và chất liệu cho từng món.",
  },
  {
    number: "02",
    iconSrc: "/Icon/technical-support.png",
    title: "AI Gợi Ý Trang Phục",
    description: "Nhận gợi ý phối đồ phù hợp thời tiết, hoàn cảnh và phong cách riêng của bạn mỗi ngày.",
  },
  {
    number: "03",
    iconSrc: "/Icon/swap.png",
    title: "Chia Sẻ & Bán Đồ",
    description: "Kết nối cộng đồng Gen Z, bán món đồ ít mặc và tìm nguồn cảm hứng mới mỗi ngày.",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Closy có miễn phí không?",
    // answer: "Hoàn toàn miễn phí! Bạn có thể số hoá tủ đồ, nhận gợi ý AI và tham gia cộng đồng mà không mất phí.",
    answer: "Sẽ có gói trải nghiệm miễn phí. Bạn có thể trải nghiệm các tính năng cơ bản như số hoá tủ đồ và nhận gợi ý AI.",
  },
  {
    question: "AI phối đồ có chính xác không?",
    answer: "AI của Closy được huấn luyện từ hàng triệu bộ outfit và liên tục học hỏi từ phong cách của bạn. Càng dùng, AI càng hiểu gu của bạn.",
  },
  {
    question: "Dữ liệu ảnh của tôi có an toàn không?",
    answer: "Tuyệt đối! Ảnh của bạn được mã hoá và lưu trữ an toàn. Chúng tôi không chia sẻ dữ liệu cá nhân với bên thứ ba.",
  },
  {
    question: "Pass đồ hoạt động như thế nào?",
    answer: "Bạn đăng món đồ ít mặc lên marketplace. Người mua liên hệ trực tiếp qua app và thoả thuận giá cả, giao nhận.",
  },
  {
    question: "Có hỗ trợ tiếng Việt không?",
    answer: "Có! Closy được thiết kế hoàn toàn cho người dùng Việt Nam, từ giao diện đến AI chatbot đều hỗ trợ tiếng Việt.",
  },
];
