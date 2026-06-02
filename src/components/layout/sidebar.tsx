"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shirt, 
  Sparkles, 
  Images, 
  Globe, 
  Tag, 
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export const NAV_ITEMS = [
  { icon: Shirt, label: "Tủ Đồ Của Tôi", path: "/wardrobe" },
  { icon: Sparkles, label: "AI Stylist", path: "/ai-stylist" },
  { icon: Images, label: "Outfit", path: "/outfits" },
  { icon: Globe, label: "Cộng Đồng", path: "/feed" },
  { icon: Tag, label: "Chợ Đồ Cũ", path: "/marketplace" },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;

  return (
    <aside className={cn(
      "hidden md:flex flex-col w-[240px] border-r h-dvh sticky top-0 bg-sidebar z-40",
      isPremium ? "border-transparent" : "border-border"
    )}>
      <div className={cn("flex flex-col justify-center px-6 border-b border-sidebar-border", isPremium ? "h-24" : "h-16")}>
        {isPremium ? (
          <>
            <Link href="/dashboard" className="text-3xl font-heading font-bold text-sidebar-foreground tracking-[4px]">
              S W
            </Link>
            <div className="text-[10px] text-primary tracking-widest mt-1">✦ PREMIUM MEMBER</div>
          </>
        ) : (
          <Link href="/" className="text-2xl font-heading font-bold text-sidebar-foreground tracking-tight">
            Smart Wardrobe
          </Link>
        )}
      </div>
      
      <nav className={cn("flex-1 px-4 flex flex-col", isPremium ? "py-8 gap-1" : "py-6 gap-2")}>
        {isPremium && <div className="border-t border-border/20 w-8 mb-6 mx-3" />}
        
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          if (isPremium) {
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "relative flex items-center px-3 py-3 rounded-md transition-all text-xs font-medium uppercase tracking-[2px]",
                  isActive 
                    ? "text-sidebar-foreground font-bold" 
                    : "text-muted-foreground hover:text-sidebar-foreground"
                )}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-primary rounded-r" />}
                <span className={cn("transition-transform", isActive ? "translate-x-1" : "hover:translate-x-1")}>{item.label}</span>
              </Link>
            );
          }
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-secondary"
              )}
            >
              <Icon className={cn("size-5", isActive ? "text-primary fill-primary/10" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Upgrade Card */}
      {!isPremium && (
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-4 border border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Sparkles className="size-16 text-primary" />
            </div>
            <h4 className="font-heading font-bold text-ink mb-1 relative z-10">Nâng cấp Premium</h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed relative z-10">
              Mở khóa không giới hạn lượt AI và tủ đồ của bạn.
            </p>
            <Link href="/pricing" className="block text-center w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm relative z-10">
              Nâng cấp ngay
            </Link>
          </div>
        </div>
      )}
      
      <Link href="/settings" className="p-4 border-t border-sidebar-border flex items-center gap-3 cursor-pointer hover:bg-secondary/50 rounded-lg transition-colors m-2 group block">
        <div className="flex items-center gap-3 w-full">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="size-10 rounded-full border border-border shrink-0" />
          ) : (
            <UserCircle className="size-10 text-muted-foreground group-hover:text-sidebar-foreground transition-colors shrink-0" />
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "@guest"}</span>
            <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
              {isPremium ? <><span className="text-primary text-[10px]">✦</span> Premium</> : "Free Plan"}
            </span>
          </div>
        </div>
      </Link>
    </aside>
  );
}
