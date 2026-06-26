"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, User as UserIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserAvatar } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/queries/auth.queries";
export function GuestHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();
  const isLoggedIn = !!user;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (pathname !== "/") {
    return null;
  }
  return (
    <>
      {" "}
      <header
        className={`fixed top-0 z-[100] w-full transition-all duration-300 ${scrolled ? "h-16 border-b border-white/10 bg-[#161616]/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl" : "h-20 bg-transparent"}`}
      >
        {" "}
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-5 md:px-8">
          {" "}
          <Link href="/" className="flex items-center gap-2">
            {" "}
            <span
              className={`font-semibold transition-all duration-300 ${scrolled ? "text-2xl text-white" : "text-[2rem] text-[#1A1A1A] md:text-[2.6rem]"}`}
            >
              {" "}
              Closy{" "}
            </span>{" "}
            <span className="text-lg font-semibold text-terracotta">.</span>{" "}
          </Link>{" "}
          <nav className="hidden items-center gap-6 md:flex">
            {" "}
            {isLoggedIn ? (
              <>
                {" "}
                <HeaderLink href="/wardrobe" scrolled={scrolled}>
                  Tủ đồ
                </HeaderLink>{" "}
                <HeaderLink href="/ai-stylist" scrolled={scrolled}>
                  AI stylist
                </HeaderLink>{" "}
                <HeaderLink href="/community" scrolled={scrolled}>
                  Cộng đồng
                </HeaderLink>{" "}
                <DropdownMenu modal={false}>
                  {" "}
                  <DropdownMenuTrigger asChild>
                    {" "}
                    <button className="outline-none">
                      {" "}
                      <Avatar
                        className={`size-10 ring-2 transition-all ${scrolled ? "ring-white/15" : "ring-[#1A1A1A]/10"}`}
                      >
                        {" "}
                        <AvatarImage
                          src={getUserAvatar(user)}
                          alt={user?.username || "User"}
                          className="object-cover"
                        />{" "}
                        <AvatarFallback className="bg-terracotta text-white">
                          {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                        </AvatarFallback>{" "}
                      </Avatar>{" "}
                    </button>{" "}
                  </DropdownMenuTrigger>{" "}
                  <DropdownMenuContent
                    align="end"
                    className="mt-2 w-56 rounded-2xl border border-border/70 p-2 shadow-xl"
                  >
                    {" "}
                    <div className="mb-2 border-b border-border/60 px-3 py-3">
                      {" "}
                      <p className="text-sm font-semibold text-foreground">
                        {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                          user?.username}
                      </p>{" "}
                      <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>{" "}
                    </div>{" "}
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
                      {" "}
                      <Link href="/profile" className="flex items-center gap-3">
                        <UserIcon className="size-4" />
                        Hồ sơ
                      </Link>{" "}
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
                      {" "}
                      <Link href="/wardrobe" className="flex items-center gap-3">
                        <LayoutDashboard className="size-4" />
                        Tủ đồ
                      </Link>{" "}
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5">
                      {" "}
                      <Link href="/profile/update" className="flex items-center gap-3">
                        <Settings className="size-4" />
                        Cài đặt
                      </Link>{" "}
                    </DropdownMenuItem>{" "}
                    <DropdownMenuSeparator className="my-1 bg-border/60" />{" "}
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="rounded-xl px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      {" "}
                      <LogOut className="mr-3 size-4" />
                      Đăng xuất{" "}
                    </DropdownMenuItem>{" "}
                  </DropdownMenuContent>{" "}
                </DropdownMenu>{" "}
              </>
            ) : (
              <>
                {" "}
                <HeaderLink href="/auth/login" scrolled={scrolled}>
                  Đăng nhập
                </HeaderLink>{" "}
                <Link href="/auth/register">
                  {" "}
                  <Button
                    className={`${scrolled ? "bg-white text-[#161616] hover:bg-[#efe7df]" : "bg-[#1A1A1A] text-white hover:bg-[#2a2a2a]"}`}
                  >
                    {" "}
                    Bắt đầu miễn phí{" "}
                  </Button>{" "}
                </Link>{" "}
              </>
            )}{" "}
          </nav>{" "}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden ${scrolled ? "text-white" : "text-[#1A1A1A]"}`}
          >
            {" "}
            {mobileMenuOpen ? (
              <X className="size-5" strokeWidth={1.8} />
            ) : (
              <Menu className="size-5" strokeWidth={1.8} />
            )}{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      <div
        className={`fixed inset-0 z-[99] flex flex-col items-center justify-center gap-7 bg-[#161616] transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {" "}
        {isLoggedIn ? (
          <>
            {" "}
            <div className="mb-6 flex flex-col items-center gap-4">
              {" "}
              <Avatar className="size-16 ring-2 ring-terracotta/80 ring-offset-4 ring-offset-[#161616]">
                {" "}
                <AvatarImage
                  src={getUserAvatar(user)}
                  alt={user?.username || "User"}
                  className="object-cover"
                />{" "}
                <AvatarFallback className="bg-terracotta text-white text-lg">
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>{" "}
              </Avatar>{" "}
              <p className="text-xl font-semibold text-white">
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username}
              </p>{" "}
            </div>{" "}
            <MobileNavLink href="/wardrobe" onClick={() => setMobileMenuOpen(false)}>
              Tủ đồ
            </MobileNavLink>{" "}
            <MobileNavLink href="/ai-stylist" onClick={() => setMobileMenuOpen(false)}>
              AI stylist
            </MobileNavLink>{" "}
            <MobileNavLink href="/community" onClick={() => setMobileMenuOpen(false)}>
              Cộng đồng
            </MobileNavLink>{" "}
            <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>
              Hồ sơ
            </MobileNavLink>{" "}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
            >
              Đăng xuất
            </button>{" "}
          </>
        ) : (
          <>
            {" "}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mb-6 text-4xl font-semibold text-white"
            >
              {" "}
              Closy<span className="text-terracotta">.</span>{" "}
            </Link>{" "}
            <MobileNavLink href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              Đăng nhập
            </MobileNavLink>{" "}
            <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
              {" "}
              <Button className="bg-white text-[#161616] hover:bg-[#efe7df]">
                Bắt đầu miễn phí
              </Button>{" "}
            </Link>{" "}
          </>
        )}{" "}
      </div>{" "}
    </>
  );
}
function HeaderLink({
  href,
  scrolled,
  children,
}: {
  href: string;
  scrolled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${scrolled ? "text-white/70 hover:text-white" : "text-[#1A1A1A]/65 hover:text-[#1A1A1A]"}`}
    >
      {" "}
      {children}{" "}
    </Link>
  );
}
function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-white/70 transition-colors hover:text-white"
    >
      {" "}
      {children}{" "}
    </Link>
  );
}
