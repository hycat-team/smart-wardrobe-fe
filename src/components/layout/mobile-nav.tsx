"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle, ShoppingBag } from "lucide-react";
import { cn, getUserAvatar } from "@/lib/utils";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useB2BDemoStore } from "@/lib/mock-data/b2b/store";
import { NAV_ITEMS } from "./sidebar";

export function MobileBottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  const { cart, setCartOpen } = useB2BDemoStore();

  return (
    <nav className="md:hidden fixed bottom-0 w-full h-[72px] pb-4 pt-2 bg-[#FAFAFA] dark:bg-[#111111] border-t border-border/60 flex items-center justify-around px-2 z-50">
      {[...NAV_ITEMS.slice(0, 4), { icon: UserCircle, label: "", path: "/profile" }].map((item) => {
        const isActive = item.path === '/wardrobe'
          ? pathname === '/wardrobe' || (pathname.startsWith('/wardrobe/') && !pathname.startsWith('/wardrobe/explore'))
          : pathname.startsWith(item.path);
        
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full relative outline-none",
              isActive ? "text-[#D9C5B2]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Active Mobile Subtle Pill */}
            {isActive && (
              <motion.div
                layoutId="mobileActivePill"
                initial={false}
                className="absolute inset-x-2 inset-y-1 rounded-xl bg-[#F4EEE8]/70 dark:bg-white/[0.06] -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <motion.div
              whileTap={{ scale: 0.88 }}
              animate={{ scale: isActive ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="flex items-center justify-center"
            >
              {item.path === '/profile' ? (
                <div className={cn(
                  "size-6 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center ring-2 ring-offset-1 ring-offset-[#FAFAFA] dark:ring-offset-[#111111]",
                  isActive ? "ring-[#D9C5B2]" : "ring-transparent"
                )}>
                  <Image
                    src={getUserAvatar(user)}
                    alt={user?.username || "User"}
                    width={24}
                    height={24}
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <Icon 
                  className={cn(
                    "size-5 transition-colors duration-200", 
                    isActive ? "text-[#D9C5B2]" : "text-muted-foreground"
                  )} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />
              )}
            </motion.div>

            {/* Magnetic Active Indicator Dot */}
            {isActive && (
              <motion.div
                layoutId="mobileActiveIndicator"
                initial={false}
                className="w-1.5 h-1.5 rounded-full bg-[#D9C5B2] shadow-[0_0_8px_rgba(217,197,178,0.8)] absolute bottom-0.5"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
      
      {/* Mobile Cart Button */}
      <button 
        onClick={() => setCartOpen(true)}
        className="flex flex-col items-center justify-center gap-1 w-full h-full transition-colors active:scale-95 relative text-muted-foreground hover:text-foreground"
      >
        <div className="relative">
          <ShoppingBag className="size-5 transition-transform duration-300" strokeWidth={1.5} />
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full z-10 shadow-sm border border-background">
              {cart.length}
            </span>
          )}
        </div>
      </button>
    </nav>
  );
}
