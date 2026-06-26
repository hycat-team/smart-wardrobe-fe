"use client";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getUserAvatar } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.isPremium;
  return (
    <>
      {" "}
      <header className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/70 bg-background/88 px-4 backdrop-blur-md">
        {" "}
        <Link href="/" className="text-lg font-semibold tracking-normal text-foreground">
          {" "}
          Smart Wardrobe{" "}
        </Link>{" "}
        <div className="flex items-center gap-3">
          {" "}
          {!isPremium && (
            <Badge variant="outline" className="h-7 gap-1.5 px-2.5 text-[11px] font-semibold">
              {" "}
              <Sparkles className="size-3 text-primary" /> 2/3 AI{" "}
            </Badge>
          )}{" "}
          <Link href="/settings" aria-label="Open settings">
            {" "}
            <Avatar className="size-9">
              {" "}
              <AvatarImage
                src={getUserAvatar(user)}
                alt={user?.username}
                className="object-cover"
              />{" "}
              <AvatarFallback>
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>{" "}
            </Avatar>{" "}
          </Link>{" "}
        </div>{" "}
      </header>{" "}
      <div className="hidden md:flex sticky top-0 z-30 h-16 items-center justify-between border-b border-border/70 bg-background/84 px-8 backdrop-blur-md">
        {" "}
        <div className="relative flex w-full max-w-md items-center">
          {" "}
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />{" "}
          <Input type="text" className="pl-9 pr-4" placeholder="Tìm kiếm outfit, tags..." />{" "}
        </div>{" "}
        <div className="flex items-center gap-4 pl-6">
          {" "}
          {!isPremium && (
            <Badge
              variant="outline"
              className="h-8 gap-2 rounded-full px-3.5 text-[11px] font-semibold shadow-sm"
            >
              {" "}
              <Sparkles className="size-3.5 text-primary" /> 2/3 AI Quota{" "}
            </Badge>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
}
