'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useB2BDemoStore, CartItem } from '@/lib/mock-data/b2b/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, ChevronLeft, CreditCard, Banknote, ShieldCheck, Package, Truck, Calendar, MapPin, Receipt } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function CheckoutClient() {
  const { cart, checkout } = useB2BDemoStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string, discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  // State for success page receipt
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [purchasedTotal, setPurchasedTotal] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const selectedItems = useMemo(() => cart.filter(item => item.selected), [cart]);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalAmount = totalAmount - (appliedVoucher?.discount || 0);

  const groupedCart = useMemo(() => {
    const groups: Record<string, { brandName: string; items: CartItem[] }> = {};
    selectedItems.forEach(item => {
      if (!groups[item.brandId]) {
        groups[item.brandId] = { brandName: item.brandName, items: [] };
      }
      groups[item.brandId].items.push(item);
    });
    return Object.entries(groups);
  }, [selectedItems]);

  useGSAP(() => {
    if (!isSuccess && selectedItems.length > 0) {
      gsap.fromTo(
        formRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo(
        summaryRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [isSuccess, selectedItems.length]);

  const handleApplyVoucher = () => {
    setVoucherError('');
    if (!voucherCode.trim()) {
      return;
    }

    if (voucherCode.toUpperCase() === 'CLOSY10') {
      setAppliedVoucher({ code: 'CLOSY10', discount: totalAmount * 0.1 });
    } else if (voucherCode.toUpperCase() === 'CLOSY50K') {
      setAppliedVoucher({ code: 'CLOSY50K', discount: 50000 });
    } else {
      setVoucherError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      setAppliedVoucher(null);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError('');
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    // Save current cart data before checkout clears it
    setPurchasedItems([...selectedItems]);
    setPurchasedTotal(finalAmount);

    // Simulate network delay
    setTimeout(() => {
      const newOrderId = checkout();
      setOrderId(newOrderId);
      setIsSuccess(true);
      setIsProcessing(false);
    }, 1500);
  };

  if (isSuccess) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
      <div className="flex-1 bg-muted text-foreground min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 py-20">
        <div className="max-w-[500px] w-full relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
          {/* Success Checkmark */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center border border-border shadow-lg relative group">
              <div className="absolute inset-0 bg-green-500 rounded-full scale-0 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
              <CheckCircle2 className="w-10 h-10 text-green-600 animate-[bounce_1s_ease-in-out]" strokeWidth={1.5} />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-foreground">
              Tuyệt vời!
            </h1>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed px-4">
              Đơn hàng của bạn đã được xác nhận. Chúng tôi đang chuẩn bị những món đồ tuyệt vời nhất dành riêng cho bạn.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-background rounded-3xl border border-border shadow-2xl p-8 relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both overflow-hidden">
            <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                <span className="font-bold text-xs uppercase tracking-widest text-foreground">Biên lai</span>
              </div>
              <span className="font-semibold text-[10px] text-muted-foreground">{formattedDate}</span>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Mã đơn hàng</span>
                <span className="text-lg font-semibold text-foreground tracking-wider">{orderId}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-foreground">{purchasedTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              {/* Overlapping Thumbnails */}
              {purchasedItems.length > 0 && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Sản phẩm ({purchasedItems.length})</span>
                  <div className="flex items-center">
                    {purchasedItems.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-muted -ml-3 first:ml-0 shadow-sm relative z-[4] hover:z-10 transition-transform hover:scale-110">
                        <img src={item.imageUrl} alt="item" className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                    ))}
                    {purchasedItems.length > 4 && (
                      <div className="w-12 h-12 rounded-full border-2 border-background bg-foreground text-background flex items-center justify-center -ml-3 relative z-0 shadow-sm font-semibold text-[10px]">
                        +{purchasedItems.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Tracker */}
            <div className="bg-muted -mx-8 px-8 py-6 border-y border-border">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border z-0"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-px bg-foreground z-0"></div>

                <div className="flex flex-col items-center gap-2 relative z-10 bg-muted px-2">
                  <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-foreground">Xác nhận</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10 bg-muted px-2 opacity-40">
                  <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-foreground">
                    <Package className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground">Xử lý</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10 bg-muted px-2 opacity-40">
                  <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-foreground">
                    <Truck className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground">Giao hàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
            <Link href="/profile/purchases" className="flex-1">
              <Button className="w-full rounded-full font-bold text-[11px] uppercase tracking-widest h-14 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] active:scale-[0.98]">
                Xem đơn hàng
              </Button>
            </Link>
            <Link href="/community" className="flex-1">
              <Button variant="outline" className="w-full rounded-full border-border bg-transparent hover:bg-muted text-foreground font-bold text-[11px] uppercase tracking-widest h-14 transition-colors">
                Tiếp tục khám phá
              </Button>
            </Link>
          </div>

          <p className="text-center mt-8 text-muted-foreground text-[10px] font-semibold animate-in fade-in duration-700 delay-1000 fill-mode-both">
            Cần hỗ trợ? <Link href="/contact" className="underline hover:text-foreground">Liên hệ với chúng tôi</Link>
          </p>
        </div>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="flex-1 bg-background text-foreground min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
          <Banknote className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-sm text-muted-foreground mb-6 uppercase tracking-widest">Không có sản phẩm nào được chọn để thanh toán.</p>
        <Link href="/marketplace">
          <Button className="rounded-full font-bold text-[10px] uppercase tracking-widest px-8 h-12">
            Khám phá Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground min-h-screen pb-24" ref={containerRef}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/community" className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-foreground mb-8 uppercase tracking-widest transition-colors group">
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Tiếp tục mua sắm
        </Link>

        <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-12 uppercase">
          Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-12" ref={formRef}>
            {/* Contact */}
            <div className="flex flex-col gap-6">
              <h2 className="font-medium text-2xl tracking-tight border-b border-border pb-4">
                1. Thông tin liên hệ
              </h2>
              <Input
                placeholder="Email hoặc số điện thoại"
                className="h-14 rounded-2xl border-border focus-visible:ring-1 focus-visible:ring-primary bg-muted/50 font-medium text-sm px-5"
                defaultValue="linh.nguyen@example.com"
              />
            </div>

            {/* Shipping */}
            <div className="flex flex-col gap-6">
              <h2 className="font-medium text-2xl tracking-tight border-b border-border pb-4">
                2. Địa chỉ giao hàng
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Họ" className="h-14 rounded-2xl border-border focus-visible:ring-1 focus-visible:ring-primary bg-muted/50 font-medium text-sm px-5" defaultValue="Nguyễn" />
                <Input placeholder="Tên" className="h-14 rounded-2xl border-border focus-visible:ring-1 focus-visible:ring-primary bg-muted/50 font-medium text-sm px-5" defaultValue="Linh" />
              </div>
              <Input placeholder="Địa chỉ cụ thể" className="h-14 rounded-2xl border-border focus-visible:ring-1 focus-visible:ring-primary bg-muted/50 font-medium text-sm px-5" defaultValue="123 Đường Fashion, Quận 1" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Thành phố" className="h-14 rounded-2xl border-border focus-visible:ring-1 focus-visible:ring-primary bg-muted/50 font-medium text-sm px-5" defaultValue="TP. Hồ Chí Minh" />
                <Input placeholder="Quận/Huyện" className="h-14 rounded-2xl border-border focus-visible:ring-1 focus-visible:ring-primary bg-muted/50 font-medium text-sm px-5" defaultValue="Quận 1" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-6">
              <h2 className="font-medium text-2xl tracking-tight border-b border-border pb-4">
                3. Phương thức thanh toán
              </h2>
              <div className="flex flex-col gap-4">
                <label
                  className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/50'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-medium text-sm text-foreground">Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                </label>

                <label
                  className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/50'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-medium text-sm text-foreground">Thẻ Tín dụng / Ghi nợ</span>
                  </div>
                  <div className="flex gap-2">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5" ref={summaryRef}>
            <div className="bg-muted p-8 flex flex-col gap-8 sticky top-24 rounded-3xl border border-border shadow-sm">
              <h2 className="font-bold text-[11px] uppercase tracking-widest border-b border-border pb-4 text-muted-foreground">
                Đơn hàng của bạn ({selectedItems.length} sản phẩm)
              </h2>

              <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {groupedCart.map(([brandId, group]) => (
                  <div key={brandId} className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-foreground border-b border-border pb-2">
                      {group.brandName}
                    </h3>
                    <div className="space-y-6">
                      {group.items.map((item, idx) => (
                        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 items-center group">
                          <div className="w-20 h-24 bg-background rounded-xl overflow-hidden flex-shrink-0 relative border border-border">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-0 right-0 bg-foreground text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-xl">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex flex-col flex-1 gap-1">
                            <span className="font-medium text-lg line-clamp-1 leading-tight text-foreground">{item.name}</span>
                            <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                              {item.size} / {item.color}
                            </span>
                          </div>
                          <span className="font-medium text-sm text-foreground">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px w-full bg-border"></div>

              {/* Voucher Input */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá..."
                    className="h-10 rounded-full border-border focus-visible:ring-1 focus-visible:ring-primary bg-background font-medium text-xs flex-1 uppercase px-4"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={!!appliedVoucher}
                  />
                  {!appliedVoucher ? (
                    <Button
                      onClick={handleApplyVoucher}
                      variant="outline"
                      className="h-10 rounded-full border-border text-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors px-6"
                    >
                      Áp dụng
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRemoveVoucher}
                      variant="outline"
                      className="h-10 rounded-full border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-border transition-colors px-6"
                    >
                      Huỷ
                    </Button>
                  )}
                </div>
                {voucherError && <span className="text-destructive text-[10px] font-bold px-4">{voucherError}</span>}
                {appliedVoucher && <span className="text-green-600 text-[10px] font-bold px-4">Đã áp dụng mã {appliedVoucher.code}</span>}
              </div>

              <div className="h-px w-full bg-border"></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between font-bold text-xs text-muted-foreground uppercase tracking-widest">
                  <span>Tạm tính</span>
                  <span className="text-foreground">{totalAmount.toLocaleString()}đ</span>
                </div>
                {appliedVoucher && (
                  <div className="flex items-center justify-between font-bold text-xs text-green-600 uppercase tracking-widest">
                    <span>Giảm giá ({appliedVoucher.code})</span>
                    <span>-{appliedVoucher.discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold text-xs text-muted-foreground uppercase tracking-widest">
                  <span>Phí vận chuyển</span>
                  <span className="text-foreground">Miễn phí</span>
                </div>
                <div className="h-px w-full bg-border my-2"></div>
                <div className="flex items-end justify-between text-foreground">
                  <span className="text-2xl font-medium">Tổng cộng</span>
                  <span className="text-3xl font-bold">{Math.max(0, finalAmount).toLocaleString()}đ</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full h-14 mt-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Hoàn tất đặt hàng
                  </>
                )}
              </Button>

              <div className="text-center">
                <span className="font-bold text-[9px] text-muted-foreground uppercase tracking-widest">
                  Thanh toán an toàn 100% được bảo mật bởi Closy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
