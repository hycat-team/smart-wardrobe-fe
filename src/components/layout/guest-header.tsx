"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { UserCircle, LayoutDashboard, User as UserIcon, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/queries/auth.queries";

import { useEffect, useState } from "react";

export function GuestHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login';
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.hasToken) {
          setHasToken(true);
        }
      })
      .catch(() => setHasToken(false));
  }, []);

  const isLoggedIn = !!user || hasToken;

  return (
    <header className="h-16 px-4 md:px-8 lg:px-12 flex items-center justify-between absolute top-0 w-full z-50 bg-transparent">
      <Link href="/" className="text-2xl font-heading font-bold text-ink">
        SW
      </Link>
      
      <nav className="flex items-center gap-4">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="size-8 rounded-full border border-border" />
                ) : (
                  <UserCircle className="size-8 text-ink" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
