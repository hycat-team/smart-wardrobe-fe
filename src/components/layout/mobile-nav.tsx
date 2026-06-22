"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { NAV_ITEMS } from "./sidebar";

export function MobileBottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;

  return (
    <nav className="md:hidden fixed bottom-0 w-full h-[72px] pb-4 pt-2 bg-card border-t border-border flex items-center justify-around px-2 z-50">
      {[...NAV_ITEMS.slice(0,4), { icon: UserCircle, label: "Hồ sơ", path: "/profile" }].map((item) => {
        const isActive = pathname.startsWith(item.path);
        const Icon = item.icon;
        
        if (isPremium) {
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-95",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5", isActive && "text-primary")} />
              <span className={cn("text-[10px] font-medium uppercase tracking-widest", isActive && "text-primary font-bold")}>{item.label.split(" ")[0]}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-1" />}
            </Link>
          );
        }
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors active:scale-95",
              isActive ? "text-primary" : "text-muted-foreground hover:text-ink"
            )}
          >
            <Icon className={cn("size-5", isActive && "fill-primary/20")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
