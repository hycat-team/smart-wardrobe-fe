"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shirt, 
  Sparkles, 
  LayoutGrid, 
  Store, 
  Settings,
  HelpCircle,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export const NAV_ITEMS = [
  { icon: Shirt, label: "Wardrobe", path: "/wardrobe" },
  { icon: Sparkles, label: "AI Stylist", path: "/ai-stylist" },
  { icon: LayoutGrid, label: "Social Feed", path: "/feed" },
  { icon: Store, label: "Marketplace", path: "/marketplace" },
];

export const BOTTOM_NAV_ITEMS = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Support", path: "/support" },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="hidden md:flex flex-col w-[260px] border-r border-sidebar-border h-dvh sticky top-0 bg-sidebar z-40 px-4 py-6">
      
      {/* User Profile Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"} 
          alt="Avatar" 
          className="size-10 rounded-full object-cover shadow-sm border border-border" 
        />
        <div className="flex flex-col">
          <span className="text-sm font-display-lg font-bold text-sidebar-foreground">
            {user?.name || "Ethos Atelier"}
          </span>
          <span className="text-[11px] font-body-sm text-sidebar-foreground/60">
            Curated Wardrobe
          </span>
        </div>
      </div>

      {/* Upload Button */}
      <button className="w-full bg-primary text-primary-foreground font-body-sm text-[13px] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-8 hover:opacity-90 transition-opacity">
        <Plus className="size-4" />
        Upload Item
      </button>
      
      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-body-sm text-[14px]",
                isActive 
                  ? "bg-accent/40 text-primary font-medium" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Premium Upgrade (Non-Premium Users) */}
      {!user?.isPremium && (
        <div className="mt-auto mb-4 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[16px] p-4 text-[#F4F1EE] shadow-lg relative overflow-hidden group border border-[#D9C5B2]/10">
          {/* Decorative glow */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#D9C5B2]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative z-10 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-4 text-[#D9C5B2]" />
              <span className="font-title-lg text-[13px] font-bold tracking-wider uppercase text-[#D9C5B2]">Premium</span>
            </div>
            <p className="font-body-sm text-[12px] text-[#F4F1EE]/80 leading-relaxed pr-2">
              Mở khóa không giới hạn lượt AI Stylist và tủ đồ.
            </p>
            <Link 
              href="/pricing"
              className="mt-2 inline-flex items-center justify-center bg-[#D9C5B2] text-[#1a1a1a] font-body-sm font-semibold text-[12px] px-3 py-2 rounded-xl hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Nâng cấp ngay
            </Link>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <div className={cn("border-t border-sidebar-border pt-4 flex flex-col gap-1", user?.isPremium && "mt-auto")}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-body-sm text-[14px]",
                isActive 
                  ? "bg-accent/40 text-primary font-medium" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
