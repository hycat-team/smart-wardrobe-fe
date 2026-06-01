"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/queries/auth.queries";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    login({ loginName: email, password }, {
      onSuccess: () => {
        router.push("/wardrobe");
      }
    });
  };

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-muted">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1550614000-4b95d466f119?auto=format&fit=crop&q=80&w=1200" 
          alt="Fashion editorial" 
          fill
          className="object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 text-white max-w-md">
          <p className="font-heading text-4xl italic leading-tight mb-2">
            Fashion is architecture: it is a matter of proportions.
          </p>
          <p className="text-white/80 font-medium">— Coco Chanel</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-24 relative">
        <Link href="/" className="absolute top-8 left-8 lg:hidden text-2xl font-heading font-bold text-ink">
          SW
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-heading font-bold text-ink">Chào mừng trở lại 👗</h1>
            <p className="text-muted-foreground">Đăng nhập để khám phá tủ đồ digital của bạn.</p>
          </div>
          
          <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm font-medium border border-primary/20">
            <p className="mb-1 font-bold">Mock Accounts (Demo):</p>
            <ul className="list-disc list-inside">
              <li>User: <code className="bg-background px-1 rounded">user@example.com</code></li>
              <li>Admin: <code className="bg-background px-1 rounded">admin@example.com</code></li>
            </ul>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">Quên mật khẩu?</Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập bất kỳ (mock)"
                className="h-12 bg-secondary border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl" 
              />
            </div>

            <Button disabled={isPending} className="w-full h-12 rounded-xl bg-ink text-cream hover:bg-ink/90 font-medium mt-6">
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">hoặc</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl border-border font-medium flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Đăng nhập với Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



