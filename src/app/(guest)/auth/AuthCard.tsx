"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which tab is active. Defaults to login if not matched.
  const isRegister = pathname.includes("/register");
  
  return (
    <div className="w-full max-w-[440px] bg-background rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col z-20 mt-16 md:mt-0">
      {/* Tabs Header */}
      <div className="flex border-b border-border">
        <Link 
          href="/auth/register"
          className={`flex-1 text-center py-5 text-[13px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative ${isRegister ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
        >
          Đăng Ký
          {mounted && isRegister && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-center scale-x-100 transition-transform duration-300" />
          )}
        </Link>
        <Link 
          href="/auth/login"
          className={`flex-1 text-center py-5 text-[13px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative ${!isRegister ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
        >
          Đăng Nhập
          {mounted && !isRegister && (
             <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-center scale-x-100 transition-transform duration-300" />
          )}
        </Link>
      </div>

      {/* Form Content Area */}
      <div className="w-full relative bg-background">
        {children}
      </div>
    </div>
  );
}
