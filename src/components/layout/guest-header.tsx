"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { UserCircle, LayoutDashboard, User as UserIcon, Settings, LogOut, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/queries/auth.queries";

import { useEffect, useState, useCallback } from "react";

export function GuestHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();
  const isLoggedIn = !!user;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chỉ hiển thị ở trang chủ (landing page)
  if (pathname !== '/') {
    return null;
  }

  return (
    <>
      <header
        className={`
          fixed top-0 w-full z-[100] transition-all duration-500 ease-out
          ${scrolled
            ? "h-14 bg-[#1A1A1A]/90 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "h-20 bg-transparent"
          }
        `}
      >
        <div className="max-w-[1400px] mx-auto h-full px-6 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="relative group flex items-baseline gap-1">
            <span
              className={`
                font-['Playfair_Display'] font-medium tracking-[-0.03em] transition-all duration-500
                ${scrolled ? "text-2xl text-white" : "text-4xl md:text-5xl text-[#1A1A1A]"}
              `}
            >
              CLOSY
            </span>
            <span
              className={`
                font-['Playfair_Display'] italic transition-all duration-500
                ${scrolled ? "text-sm text-[#D9C5B2]" : "text-lg md:text-xl text-[#D9C5B2]"}
              `}
            >
              .
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {isLoggedIn ? (
              <>
                <Link
                  href="/wardrobe"
                  className={`
                    font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] transition-all duration-300
                    hover:opacity-100
                    ${scrolled ? "text-white/60 hover:text-white" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"}
                  `}
                >
                  Tủ đồ
                </Link>
                <Link
                  href="/ai-stylist"
                  className={`
                    font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] transition-all duration-300
                    hover:opacity-100
                    ${scrolled ? "text-white/60 hover:text-white" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"}
                  `}
                >
                  AI Stylist
                </Link>
                <Link
                  href="/community"
                  className={`
                    font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] transition-all duration-300
                    hover:opacity-100
                    ${scrolled ? "text-white/60 hover:text-white" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"}
                  `}
                >
                  Cộng đồng
                </Link>

                {/* Divider */}
                <div className={`w-px h-5 transition-colors duration-500 ${scrolled ? "bg-white/10" : "bg-[#1A1A1A]/10"}`} />

                {/* Avatar Dropdown */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="relative group/avatar outline-none">
                      <div className={`
                        size-9 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center
                        ring-2 ring-offset-2 group-hover/avatar:ring-[#D9C5B2]
                        ${scrolled
                          ? "ring-white/20 ring-offset-[#1A1A1A]"
                          : "ring-[#1A1A1A]/10 ring-offset-[#F4F1EE]"
                        }
                      `}>
                        {user?.avatarUrl ? (
                          <Avatar className="size-9">
                            <AvatarImage src={user.avatarUrl} alt={user.username || "User"} />
                            <AvatarFallback className="bg-[#D9C5B2] text-white font-['IBM_Plex_Mono'] text-xs">
                              {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`
                            size-full flex items-center justify-center font-['IBM_Plex_Mono'] text-xs font-medium
                            ${scrolled ? "bg-white/10 text-white" : "bg-[#1A1A1A]/5 text-[#1A1A1A]"}
                          `}>
                            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-none border border-[#1A1A1A]/10 bg-white p-2 shadow-lg mt-2"
                  >
                    <div className="px-3 py-3 border-b border-[#1A1A1A]/5 mb-2">
                      <p className="font-['Playfair_Display'] text-base font-medium text-[#1A1A1A]">
                        {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username}
                      </p>
                      <p className="font-['IBM_Plex_Mono'] text-[10px] text-[#707070] uppercase tracking-wider mt-1">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer rounded-none font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider py-2.5 text-[#1A1A1A]/70 hover:text-[#1A1A1A] focus:bg-[#F4F1EE]">
                        <UserIcon className="mr-3 h-4 w-4" />
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wardrobe" className="cursor-pointer rounded-none font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider py-2.5 text-[#1A1A1A]/70 hover:text-[#1A1A1A] focus:bg-[#F4F1EE]">
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Tủ đồ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/update" className="cursor-pointer rounded-none font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider py-2.5 text-[#1A1A1A]/70 hover:text-[#1A1A1A] focus:bg-[#F4F1EE]">
                        <Settings className="mr-3 h-4 w-4" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#1A1A1A]/5" />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="cursor-pointer rounded-none font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`
                    font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] transition-all duration-300
                    ${scrolled ? "text-white/60 hover:text-white" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"}
                  `}
                >
                  Đăng nhập
                </Link>
                <Link href="/auth/register">
                  <button
                    className={`
                      font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.15em] px-7 py-2.5 transition-all duration-500 border
                      ${scrolled
                        ? "bg-white text-[#1A1A1A] border-white hover:bg-[#D9C5B2] hover:border-[#D9C5B2] hover:text-white"
                        : "bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-[#D9C5B2] hover:border-[#D9C5B2]"
                      }
                    `}
                  >
                    Bắt Đầu Miễn Phí
                  </button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileMenuOpen}
            className={`
              md:hidden size-10 flex items-center justify-center transition-colors duration-300
              ${scrolled ? "text-white" : "text-[#1A1A1A]"}
            `}
          >
            {mobileMenuOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-[99] bg-[#1A1A1A] transition-all duration-500 flex flex-col items-center justify-center gap-8
          ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {isLoggedIn ? (
          <>
            {/* User Info */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="size-16 rounded-full overflow-hidden ring-2 ring-[#D9C5B2] ring-offset-4 ring-offset-[#1A1A1A]">
                {user?.avatarUrl ? (
                  <Avatar className="size-16">
                    <AvatarImage src={user.avatarUrl} alt={user.username || "User"} />
                    <AvatarFallback className="bg-[#D9C5B2] text-white text-lg">{user.firstName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="size-full bg-[#D9C5B2] flex items-center justify-center text-white font-['Playfair_Display'] text-2xl">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <p className="font-['Playfair_Display'] text-white text-xl">
                {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username}
              </p>
            </div>

            <MobileNavLink href="/wardrobe" onClick={() => setMobileMenuOpen(false)}>Tủ đồ</MobileNavLink>
            <MobileNavLink href="/ai-stylist" onClick={() => setMobileMenuOpen(false)}>AI Stylist</MobileNavLink>
            <MobileNavLink href="/community" onClick={() => setMobileMenuOpen(false)}>Cộng đồng</MobileNavLink>
            <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>Hồ sơ</MobileNavLink>

            <div className="w-12 h-px bg-white/10 my-4" />

            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.3em] text-red-400 hover:text-red-300 transition-colors"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Playfair_Display'] text-5xl text-white font-medium mb-8"
            >
              CLOSY<span className="text-[#D9C5B2] italic">.</span>
            </Link>

            <MobileNavLink href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</MobileNavLink>

            <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
              <button className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.15em] px-10 py-3 bg-white text-[#1A1A1A] hover:bg-[#D9C5B2] hover:text-white transition-all duration-300 mt-4">
                Bắt Đầu Miễn Phí
              </button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
