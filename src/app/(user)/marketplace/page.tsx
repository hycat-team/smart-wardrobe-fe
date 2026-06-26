import { Heart, Search, SlidersHorizontal, Tag } from "lucide-react";
import Image from "next/image";

const MARKETPLACE_ITEMS = [
  {
    id: "m1",
    name: "Structured Wool Coat",
    brand: "Studio Nicholson",
    price: "$450",
    condition: "Như mới",
    size: "Size M",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0FYW6smtxDjgvmjUwqMakLGNgnkh50pSVfvNwEXWOPs_9BQuLr9UURaHp38uo_0L-RaKfBmvalwNgQO5P6wrzHgVDjvYxehj1TRdj-ch_D7xttnNNUFsYUd_Z1XrX5yLW61KKXfaJBax9NdJJWuQbIxftTmfgegPobfSesssQQaK4KYngT1jvab2U6aFSVwID4NIvXiaoiY0WLKELAzF2UX2_aPY7JRuEkXnARGaH159mJ9yXiw9kP14fWaavkQOVDlwyG4yY7iQ",
    badgeClass: "bg-[#111] text-white"
  },
  {
    id: "m2",
    name: "Cashmere Blend Knit",
    brand: "Lemaire",
    price: "$280",
    condition: "Ít dùng",
    size: "Size L",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQivzdnCeL4RzgHKNCYuZpbO1KWTERYbwElC40Ws_KqbZCCihBQ4dJu4NxayAt12AFunuKYEleNR3mjDQCTPFMufVAGKL5xk7qCKp3bOe9d6_6dTg3J4JG9K4LURPg0yMpFqchuQmum6bM71Jiuh8k2rzFnrJfo8qkfO5hBcdsQysk8QiBKXU_TN4CnfiLDLOSi66UMzNicuQAq4mWPy1rVyObzc1xZtYqgEPTWe7UUUv8YVMxbM82PGPjF3fiJNax5dM4M6CU9eg",
    badgeClass: "bg-white border border-[#111] text-[#111]"
  },
  {
    id: "m3",
    name: "Ecru Twill Trousers",
    brand: "Jil Sander",
    price: "$320",
    condition: "Tuyệt vời",
    size: "Size S",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_mWmD2DkZj84pyivprF2beHKkkRyQw6gsSdLYLZ7i2nDJwhq_WVF1uHyDJCtgi9RB3QZZwmEG6FCcV6xM8MEsU44PJSOVGi1Aj8-nw3hZ7fpiUqKVSNDezADA3ywxAHLT5GWNYzQOqFCmx-eJneKR8pEvfktk0C1QyZNITRtRokbkY-QuAFhrnKPH05VBYm3Mpx2j2RHUKQGNckVO_2VsBfS4K8vsRtPB5oQqwDdMWja_H_o62DNjc10xksXACaqecyovVQY3Ztk",
    badgeClass: "bg-[#111] text-white"
  },
  {
    id: "m4",
    name: "Classic Crossbody",
    brand: "The Row",
    price: "$850",
    condition: "Vintage",
    size: "One Size",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEzNLPNDj1L-kD3cioSTGjfyTeh8K93-T4-u_rnTuGVa4mkQsZ2PPr0zJ_KyntYtCJuqAif35x6JUL69gMMAleI1E375gw2ZYMgUui7lnUrsbAQj07q-A5v46XP3buHyki3fMg-VDaU-xAUxZaOPvgtg3fXY5VhHPFlHnjcNpHWUapy2IummPMi9JRzpzXVYeDnmGSmeMdWOjfecau-xwATWYFyne_f9QUa5pTgMDkSs1DBzLxKvDvIwVWdhavdluCbYIc76pO16s",
    badgeClass: "bg-[#111] text-white"
  },
];

export const metadata = {
  title: 'Marketplace | Smart Wardrobe',
  description: 'Curated exchange for pre-owned luxury and sustainable pieces.',
};

export default function Marketplace() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24 text-[#111]">
      
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-8 md:pt-12 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1] uppercase">
              MARKETPLACE
            </h1>
            <p className="text-[12px] text-[#666] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              Trao đổi, mua bán các sản phẩm thời trang bền vững và thiết kế độc bản. Kéo dài vòng đời của những trang phục chất lượng.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <button className="h-12 px-8 bg-[#111] text-white font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-colors">
              <Tag className="size-4" />
              Đăng bán
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-4">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {["Tất cả", "Áo khoác", "Đồ len", "Phụ kiện"].map((tab, idx) => (
              <button
                key={tab}
                className={`text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-[0.12em] relative transition-colors group pb-1 ${
                  idx === 0 
                    ? "text-[#111] font-medium border-b border-[#111]" 
                    : "text-[#666] hover:text-[#111] border-b border-transparent hover:border-[#111]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 border border-black/10 px-4 py-2 bg-[#F8F7F5] cursor-pointer hover:bg-[#111] hover:text-white transition-colors group">
            <SlidersHorizontal className="size-3.5 text-[#888] group-hover:text-white" />
            <span className="text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-[0.2em] text-[#111] font-medium group-hover:text-white">Bộ lọc</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
        {MARKETPLACE_ITEMS.map((item) => (
          <a key={item.id} className="group flex flex-col cursor-pointer relative bg-[#F8F7F5] border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out" href="#">
            
            {/* Image Area */}
            <div className="relative w-full overflow-hidden bg-[#e0dcd5] aspect-[3/4] flex-shrink-0">
              <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={item.name} 
                className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.02]" 
                src={item.img} 
              />
              
              {/* Condition Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-[9px] font-['IBM_Plex_Mono'] px-3 py-1.5 uppercase tracking-[0.12em] ${item.badgeClass}`}>
                  {item.condition}
                </span>
              </div>
              
              {/* Action overlay */}
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-black/40 hover:text-red-500 transition-colors">
                  <Heart className="size-5" />
                </button>
              </div>

              {/* Hover View Details */}
              <div className="absolute inset-0 bg-white/92 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-end pb-8 pointer-events-none">
                <div className="text-black font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] border-b border-black pb-0.5 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Xem chi tiết
                </div>
              </div>
            </div>
            
            {/* Information Area */}
            <div className="flex flex-col p-4 pt-5 flex-grow justify-between gap-3 bg-white border-t border-black/5">
              <div>
                <h3 className="font-['Playfair_Display'] text-[22px] font-medium leading-[130%] text-[#111] line-clamp-2">
                  {item.name}
                </h3>
                <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#666] mt-2 truncate">
                  {item.brand}
                </p>
              </div>
              <div className="flex justify-between items-center font-['IBM_Plex_Mono'] text-[11px] text-[#888]">
                <span>{item.size}</span>
                <span className="text-[13px] font-medium text-[#111]">{item.price}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-16 flex justify-center border-t border-black/10 pt-12">
        <button className="text-[11px] font-['IBM_Plex_Mono'] tracking-[0.2em] uppercase text-[#666] hover:text-[#111] transition-colors border-b border-transparent hover:border-[#111] pb-1">
          Tải Thêm
        </button>
      </div>
    </div>
  );
}
