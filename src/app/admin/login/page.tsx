"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowLeft, Terminal } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for realistic premium UX
    setTimeout(() => {
      setIsLoading(false);
      if (email === "admin@example.com") {
        toast.success("Đăng nhập quản trị viên thành công!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Thông tin đăng nhập không hợp lệ. Dùng admin@example.com");
      }
    }, 1000);
  };

  return (
    <div className="dark min-h-dvh w-full bg-[#0B0B0A] text-[#FAF7F2] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative background grid and ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9714A_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#B8975A] rounded-full filter blur-[120px] opacity-[0.04]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#C9714A] rounded-full filter blur-[120px] opacity-[0.04]" />

      {/* Top Header */}
      <header className="w-full border-b border-[#222220] h-16 flex items-center justify-between px-6 md:px-12 backdrop-blur-md bg-[#0B0B0A]/60 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#B0A9A0] hover:text-[#FAF7F2] transition-colors"
        >
          <ArrowLeft className="size-4" /> TRANG CHỦ
        </Link>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-500/80 tracking-wider">SYSTEM: ONLINE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="bg-[#121211] border border-[#222220] p-8 md:p-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#B8975A] to-transparent" />

            {/* Header section inside card */}
            <div className="text-center space-y-3 mb-8">
              <div className="mx-auto size-12 bg-[#1A1A19] border border-[#2A2A28] rounded-xl flex items-center justify-center shadow-inner">
                <ShieldCheck className="size-6 text-[#B8975A]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-heading font-medium tracking-wide text-[#FAF7F2]">
                  SW CONTROL PANEL
                </h1>
                <p className="text-xs text-[#B0A9A0] font-mono tracking-wider uppercase">
                  Đăng nhập quản trị hệ thống
                </p>
              </div>
            </div>

            {/* Demonstration Helper Box */}
            <div className="bg-[#1A1A19] border border-[#2A2A28] px-4 py-3 rounded-xl text-xs font-mono text-[#B0A9A0] mb-6">
              <span className="text-[#B8975A] font-semibold">Tài khoản quản trị demo:</span>
              <div className="mt-1 flex items-center justify-between">
                <span>admin@example.com</span>
                <span className="text-[#6B6560]">(Mật khẩu tùy ý)</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs text-[#B0A9A0] font-mono uppercase tracking-wider">
                  Email quản trị
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#6B6560]" />
                  <Input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="h-12 pl-11 bg-[#1A1A19] border-[#2A2A28] focus-visible:ring-1 focus-visible:ring-[#B8975A] focus-visible:border-[#B8975A] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password" className="text-xs text-[#B0A9A0] font-mono uppercase tracking-wider">
                    Mật khẩu bảo mật
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#6B6560]" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-12 pl-11 pr-11 bg-[#1A1A19] border-[#2A2A28] focus-visible:ring-1 focus-visible:ring-[#B8975A] focus-visible:border-[#B8975A] rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6560] hover:text-[#FAF7F2] transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#B8975A] hover:bg-[#A3834A] text-[#121211] font-medium rounded-xl mt-6 relative transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 border-2 border-[#121211] border-t-transparent rounded-full animate-spin" />
                    ĐANG XÁC THỰC...
                  </span>
                ) : (
                  "ĐĂNG NHẬP HỆ THỐNG"
                )}
              </Button>
            </form>
          </div>

          {/* Footer security message inside dashboard */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-mono text-[#6B6560]">
            <Terminal className="size-3.5 text-[#B8975A]" />
            <span>SECURE GATEWAY v1.0.4 // SSL-ACTIVE</span>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full border-t border-[#222220] py-4 text-center text-[10px] font-mono text-[#6B6560] z-10">
        © 2026 Smart Wardrobe Admin Control. All Rights Reserved.
      </footer>
    </div>
  );
}


