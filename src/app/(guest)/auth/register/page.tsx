"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister, useConfirmRegisterOtp } from "@/features/auth/queries/auth.queries";
import { toast } from "sonner";
import { Gender } from "@/common/enum";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    address: "",
    gender: Gender.Unknown,
  });
  
  const [otpCode, setOtpCode] = useState("");

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: confirmOtp, isPending: isConfirming } = useConfirmRegisterOtp();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    register(formData, {
      onSuccess: () => {
        setStep("otp");
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }

    confirmOtp({ email: formData.email, otpCode }, {
      onSuccess: () => {
        router.push("/auth/login");
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'gender' ? Number(value) : value }));
  };

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-muted">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" 
          alt="Fashion editorial" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 text-white max-w-md">
          <p className="font-heading text-4xl italic leading-tight mb-2">
            "Dress shabbily and they remember the dress; dress impeccably and they remember the woman."
          </p>
          <p className="text-white/80 font-medium">— Coco Chanel</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 left-8 lg:hidden text-2xl font-heading font-bold text-ink">
          SW
        </Link>
        <div className="absolute top-8 right-8 text-sm font-medium text-ink-muted flex items-center gap-2">
          Bước 1/2 <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden"><div className="w-1/2 h-full bg-primary" /></div>
        </div>

        <div className="w-full max-w-lg space-y-8 mt-12 lg:mt-0">
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-heading font-bold text-ink">
              {step === "register" ? "Tạo tài khoản ✨" : "Xác thực OTP 🔐"}
            </h1>
            <p className="text-muted-foreground">
              {step === "register" ? "Bắt đầu hành trình thời trang thông minh." : `Mã OTP đã được gửi đến ${formData.email}`}
            </p>
          </div>

          {step === "register" ? (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nguyễn" className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Văn A" className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="nguyenvana" className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select 
                    id="gender" name="gender" value={formData.gender} onChange={handleChange}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-transparent bg-secondary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-primary focus-visible:border-primary"
                  >
                    <option value={Gender.Unknown}>Không xác định</option>
                    <option value={Gender.Male}>Nam</option>
                    <option value={Gender.Female}>Nữ</option>
                    <option value={Gender.Other}>Khác</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Đường ABC, Quận 1, TP.HCM" className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận MK</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" required minLength={6} />
                </div>
              </div>

              <Button type="submit" disabled={isRegistering} className="w-full h-12 rounded-xl bg-ink text-cream hover:bg-ink/90 font-medium mt-6 shadow-lg shadow-ink/20 hover:scale-[1.02] transition-transform">
                {isRegistering ? "Đang xử lý..." : "Tạo tài khoản"}
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <Label htmlFor="otp">Mã xác thực (OTP)</Label>
                <Input 
                  id="otp" 
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value)} 
                  placeholder="Nhập 6 số OTP" 
                  className="h-12 text-center tracking-widest text-lg bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" 
                  required 
                />
              </div>
              <Button type="submit" disabled={isConfirming} className="w-full h-12 rounded-xl bg-ink text-cream hover:bg-ink/90 font-medium mt-6">
                {isConfirming ? "Đang xác thực..." : "Xác thực"}
              </Button>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setStep("register")} className="text-sm text-muted-foreground hover:text-ink underline">
                  Quay lại
                </button>
              </div>
            </form>
          )}

          {step === "register" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">hoặc</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-xl border-border font-medium flex items-center gap-2 hover:bg-secondary transition-colors">
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Đăng ký với Google
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-8">
                Đã có tài khoản?{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:underline underline-offset-4">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
