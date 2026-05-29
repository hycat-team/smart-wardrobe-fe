"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      router.push("/upgrade/success");
    }, 2000);
  };

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col p-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto w-full pt-8 pb-16">
        
        <Link 
          href="/upgrade" 
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-3.5" /> QUAY LẠI
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Form Checkout */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h1 className="text-3xl font-heading font-medium tracking-wide">Thanh Toán</h1>
              <p className="text-muted-foreground mt-2 text-sm">Hoàn tất nâng cấp Atelier Premium của bạn.</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider font-semibold border-b border-border pb-2">Thông tin thẻ</h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-xs">Tên trên thẻ</Label>
                    <Input id="cardName" required placeholder="NGUYEN VAN A" className="h-11 bg-card uppercase" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-xs">Số thẻ</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="cardNumber" required placeholder="0000 0000 0000 0000" className="h-11 pl-10 bg-card font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-xs">Hết hạn</Label>
                      <Input id="expiry" required placeholder="MM/YY" className="h-11 bg-card font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-xs">CVV</Label>
                      <Input id="cvv" required placeholder="123" className="h-11 bg-card font-mono" type="password" maxLength={3} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Lock className="size-3" />
                <span>Thông tin thanh toán được mã hóa bảo mật 256-bit.</span>
              </div>

              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-widest uppercase font-bold text-xs"
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán 99.000đ"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border p-6 rounded-2xl sticky top-24 space-y-6">
              <h3 className="text-sm font-mono uppercase tracking-wider font-semibold border-b border-border pb-2">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-heading font-semibold text-lg text-primary">Atelier Premium</p>
                    <p className="text-xs text-muted-foreground">Gói tháng</p>
                  </div>
                  <p className="font-mono text-sm">99.000đ</p>
                </div>
                
                <ul className="space-y-2 pt-2">
                  {[
                    "Không giới hạn lưu trữ",
                    "Lookbook Editorial",
                    "Style DNA Radar",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center font-bold">
                <span>Tổng cộng</span>
                <span className="text-xl font-heading text-primary">99.000đ</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


