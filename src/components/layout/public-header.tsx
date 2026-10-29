'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, Settings, User as UserIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/features/auth/queries/auth.queries';
import { getUserAvatar } from '@/lib/utils';
import { isBrandFeatureEnabled } from '@/lib/brand-feature';

export function PublicHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;
  const brandEnabled = isBrandFeatureEnabled();
  const loginHref = `/auth/login?returnUrl=${encodeURIComponent(pathname || '/')}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/logo-only.png" alt="Closy" width={32} height={32} className="size-8 object-contain" />
          <span className="text-lg font-bold tracking-tight">CLOSY</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {brandEnabled && (
            <Button variant="ghost" className="rounded-full text-sm" render={<Link href="/brands" />}>
              Thương hiệu
            </Button>
          )}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border pl-1 pr-3 py-1 hover:bg-muted">
                  <Image
                    src={getUserAvatar(user)}
                    alt={user?.username || 'User'}
                    width={28}
                    height={28}
                    className="size-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold">{user?.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-2xl border-border bg-card p-2">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer rounded-xl">
                    <UserIcon className="mr-2 size-4" /> Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/update" className="cursor-pointer rounded-xl">
                    <Settings className="mr-2 size-4" /> Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer rounded-xl text-destructive">
                  <LogOut className="mr-2 size-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full text-sm" render={<Link href={loginHref} />}>
                Đăng nhập
              </Button>
              <Button className="rounded-full text-sm" render={<Link href="/auth/register" />}>
                Bắt đầu miễn phí
              </Button>
            </>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {brandEnabled && (
              <Link href="/brands" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">
                Thương hiệu
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">
                  Hồ sơ
                </Link>
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-destructive"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href={loginHref} onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">
                  Đăng nhập
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">
                  Bắt đầu miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
