"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GuestHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login';

  return (
    <header className="h-16 px-4 md:px-8 lg:px-12 flex items-center justify-between absolute top-0 w-full z-50 bg-transparent">
      <Link href="/" className="text-2xl font-heading font-bold text-ink">
        SW
      </Link>
      
      <nav className="flex items-center gap-4">
        {isLoginPage ? (
          <Link href="/auth/register">
            <Button variant="outline" className="rounded-full px-6 border-ink/20 hover:border-ink hover:bg-transparent">
              Đăng ký
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Đăng nhập
            </Link>
            <Link href="/auth/register">
              <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                Bắt Đầu Miễn Phí
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
