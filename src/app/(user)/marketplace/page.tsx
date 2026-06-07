"use client";
import { Heart, Search, SlidersHorizontal, Tag } from "lucide-react";

const MARKETPLACE_ITEMS = [
  {
    id: "m1",
    name: "Structured Wool Coat",
    brand: "Studio Nicholson",
    price: "$450",
    condition: "Like New",
    size: "Size M • Organic Wool",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0FYW6smtxDjgvmjUwqMakLGNgnkh50pSVfvNwEXWOPs_9BQuLr9UURaHp38uo_0L-RaKfBmvalwNgQO5P6wrzHgVDjvYxehj1TRdj-ch_D7xttnNNUFsYUd_Z1XrX5yLW61KKXfaJBax9NdJJWuQbIxftTmfgegPobfSesssQQaK4KYngT1jvab2U6aFSVwID4NIvXiaoiY0WLKELAzF2UX2_aPY7JRuEkXnARGaH159mJ9yXiw9kP14fWaavkQOVDlwyG4yY7iQ",
    badgeClass: "bg-tertiary-container text-on-tertiary"
  },
  {
    id: "m2",
    name: "Cashmere Blend Knit",
    brand: "Lemaire",
    price: "$280",
    condition: "Gently Used",
    size: "Size L • Recycled Blend",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQivzdnCeL4RzgHKNCYuZpbO1KWTERYbwElC40Ws_KqbZCCihBQ4dJu4NxayAt12AFunuKYEleNR3mjDQCTPFMufVAGKL5xk7qCKp3bOe9d6_6dTg3J4JG9K4LURPg0yMpFqchuQmum6bM71Jiuh8k2rzFnrJfo8qkfO5hBcdsQysk8QiBKXU_TN4CnfiLDLOSi66UMzNicuQAq4mWPy1rVyObzc1xZtYqgEPTWe7UUUv8YVMxbM82PGPjF3fiJNax5dM4M6CU9eg",
    badgeClass: "bg-secondary-container text-on-secondary-container"
  },
  {
    id: "m3",
    name: "Ecru Twill Trousers",
    brand: "Jil Sander",
    price: "$320",
    condition: "Excellent",
    size: "Size S • Organic Cotton",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_mWmD2DkZj84pyivprF2beHKkkRyQw6gsSdLYLZ7i2nDJwhq_WVF1uHyDJCtgi9RB3QZZwmEG6FCcV6xM8MEsU44PJSOVGi1Aj8-nw3hZ7fpiUqKVSNDezADA3ywxAHLT5GWNYzQOqFCmx-eJneKR8pEvfktk0C1QyZNITRtRokbkY-QuAFhrnKPH05VBYm3Mpx2j2RHUKQGNckVO_2VsBfS4K8vsRtPB5oQqwDdMWja_H_o62DNjc10xksXACaqecyovVQY3Ztk",
    badgeClass: "bg-tertiary-container text-on-tertiary"
  },
  {
    id: "m4",
    name: "Classic Crossbody",
    brand: "The Row",
    price: "$850",
    condition: "Vintage",
    size: "One Size • Veg-Tanned",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEzNLPNDj1L-kD3cioSTGjfyTeh8K93-T4-u_rnTuGVa4mkQsZ2PPr0zJ_KyntYtCJuqAif35x6JUL69gMMAleI1E375gw2ZYMgUui7lnUrsbAQj07q-A5v46XP3buHyki3fMg-VDaU-xAUxZaOPvgtg3fXY5VhHPFlHnjcNpHWUapy2IummPMi9JRzpzXVYeDnmGSmeMdWOjfecau-xwATWYFyne_f9QUa5pTgMDkSs1DBzLxKvDvIwVWdhavdluCbYIc76pO16s",
    badgeClass: "bg-secondary-container text-on-secondary-container"
  },
];

export default function Marketplace() {
  return (
    <div className="flex-1 w-full max-w-container-max mx-auto px-gutter md:px-margin-desktop pt-8 pb-16 animate-in fade-in duration-500">
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-display-lg text-[36px] md:text-[48px] text-primary mb-2 tracking-tight">Curated Exchange</h2>
          <p className="font-body-lg text-[16px] text-on-surface-variant max-w-2xl">
            Discover pre-owned luxury and sustainable pieces from the Ethos community. Extend the lifecycle of exceptional garments.
          </p>
        </div>
        <button className="self-start md:self-auto bg-primary text-on-primary font-body-lg text-[14px] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-inverse-surface hover:shadow-lg transition-all duration-300 min-h-[48px]">
          <span className="material-symbols-outlined text-[18px]">sell</span>
          Sell an Item
        </button>
      </div>

      {/* Minimal Filter Bar */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-8">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <button className="font-label-caps text-[12px] uppercase tracking-widest text-primary border-b-2 border-primary pb-4 -mb-[18px] whitespace-nowrap font-bold">
            All Items
          </button>
          <button className="font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors pb-4 -mb-[18px] whitespace-nowrap font-bold">
            Outerwear
          </button>
          <button className="font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors pb-4 -mb-[18px] whitespace-nowrap font-bold">
            Knitwear
          </button>
          <button className="font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors pb-4 -mb-[18px] whitespace-nowrap font-bold">
            Accessories
          </button>
        </div>
        <button className="flex items-center gap-2 font-body-sm text-[14px] text-on-surface-variant hover:text-primary transition-colors pl-4">
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Product Grid (Spacious, Editorial) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
        {MARKETPLACE_ITEMS.map((item) => (
          <a key={item.id} className="group block relative cursor-pointer" href="#">
            <div className="aspect-[3/4] rounded-xl bg-surface-container-low overflow-hidden mb-4 relative transition-shadow duration-300 group-hover:shadow-[0px_10px_30px_rgba(45,45,45,0.08)]">
              <img 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                src={item.img} 
              />
              
              {/* Condition Badge */}
              <div className={`absolute top-3 left-3 ${item.badgeClass} font-label-caps text-[10px] px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-sm bg-opacity-90 font-bold`}>
                {item.condition}
              </div>
              
              <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                <Heart className="size-5" />
              </button>
            </div>
            
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-body-sm text-[14px] font-medium text-on-surface-variant mb-1">{item.brand}</p>
                <h3 className="font-title-lg text-[20px] font-semibold text-primary line-clamp-1 leading-tight mb-2 tracking-tight">
                  {item.name}
                </h3>
                <p className="font-label-caps text-[12px] uppercase text-on-surface-variant/70 tracking-wider">
                  {item.size}
                </p>
              </div>
              <p className="font-body-lg text-[16px] font-medium text-primary whitespace-nowrap">{item.price}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <button className="border border-outline text-primary font-body-sm text-[14px] px-8 py-3 rounded-full hover:bg-surface-variant transition-colors duration-300 min-h-[48px]">
          Load More Pieces
        </button>
      </div>
    </div>
  );
}
