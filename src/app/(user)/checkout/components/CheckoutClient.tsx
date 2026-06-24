'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useB2BDemoStore, CartItem } from '@/lib/mock-data/b2b/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, ChevronLeft, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
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
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string, discount: number} | null>(null);
  const [voucherError, setVoucherError] = useState('');
  
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
    // Simulate network delay
    setTimeout(() => {
      const newOrderId = checkout();
      setOrderId(newOrderId);
      setIsSuccess(true);
      setIsProcessing(false);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 bg-[#FAFAFA] text-[#111] min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium tracking-tight mb-4 text-center">
          Đặt hàng thành công!
        </h1>
        <p className="text-[#666] mb-8 text-center max-w-[400px] font-['IBM_Plex_Mono'] text-sm leading-relaxed">
          Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
        </p>
        <div className="bg-white px-8 py-4 border border-black/10 mb-10 inline-flex flex-col items-center shadow-sm">
          <span className="text-[10px] text-[#A3A3A3] uppercase tracking-widest font-['IBM_Plex_Mono'] mb-1">Mã đơn hàng</span>
          <span className="text-lg font-medium text-[#111] font-['IBM_Plex_Mono'] tracking-wider">{orderId}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]">
          <Link href="/profile/purchases" className="flex-1">
            <Button className="w-full rounded-none bg-[#111] hover:bg-black text-white font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-widest h-14 transition-transform active:scale-[0.98]">
              Xem đơn hàng
            </Button>
          </Link>
          <Link href="/community" className="flex-1">
            <Button variant="outline" className="w-full rounded-none border-black/20 hover:bg-black/5 text-[#111] font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-widest h-14 transition-colors">
              Tiếp tục khám phá
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="flex-1 bg-white text-[#111] min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-20 h-20 bg-[#F5F2EE] rounded-full flex items-center justify-center mb-6">
          <Banknote className="w-8 h-8 text-[#A3A3A3]" strokeWidth={1.5} />
        </div>
        <p className="font-['IBM_Plex_Mono'] text-sm text-[#666] mb-6 uppercase tracking-widest">Không có sản phẩm nào được chọn để thanh toán.</p>
        <Link href="/marketplace">
          <Button className="rounded-none bg-[#111] hover:bg-black text-white font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest px-8 h-12">
            Khám phá Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white text-[#111] min-h-screen pb-24" ref={containerRef}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/community" className="inline-flex items-center gap-2 text-[10px] font-['IBM_Plex_Mono'] text-[#A3A3A3] hover:text-[#111] mb-8 uppercase tracking-widest transition-colors group">
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
          Tiếp tục mua sắm
        </Link>
        
        <h1 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-medium tracking-tight mb-12 uppercase">
          Thanh toán
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-12" ref={formRef}>
            {/* Contact */}
            <div className="flex flex-col gap-6">
              <h2 className="font-['Playfair_Display'] text-2xl font-medium tracking-tight border-b border-black/10 pb-4">
                1. Thông tin liên hệ
              </h2>
              <Input 
                placeholder="Email hoặc số điện thoại" 
                className="h-14 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-[#FAFAFA] font-['IBM_Plex_Mono'] text-sm" 
                defaultValue="linh.nguyen@example.com" 
              />
            </div>

            {/* Shipping */}
            <div className="flex flex-col gap-6">
              <h2 className="font-['Playfair_Display'] text-2xl font-medium tracking-tight border-b border-black/10 pb-4">
                2. Địa chỉ giao hàng
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Họ" className="h-14 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-[#FAFAFA] font-['IBM_Plex_Mono'] text-sm" defaultValue="Nguyễn" />
                <Input placeholder="Tên" className="h-14 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-[#FAFAFA] font-['IBM_Plex_Mono'] text-sm" defaultValue="Linh" />
              </div>
              <Input placeholder="Địa chỉ cụ thể" className="h-14 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-[#FAFAFA] font-['IBM_Plex_Mono'] text-sm" defaultValue="123 Đường Fashion, Quận 1" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Thành phố" className="h-14 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-[#FAFAFA] font-['IBM_Plex_Mono'] text-sm" defaultValue="TP. Hồ Chí Minh" />
                <Input placeholder="Quận/Huyện" className="h-14 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-[#FAFAFA] font-['IBM_Plex_Mono'] text-sm" defaultValue="Quận 1" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-6">
              <h2 className="font-['Playfair_Display'] text-2xl font-medium tracking-tight border-b border-black/10 pb-4">
                3. Phương thức thanh toán
              </h2>
              <div className="flex flex-col gap-4">
                <label 
                  className={`flex items-center justify-between p-5 border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#111] bg-[#FAFAFA]' : 'border-black/10 hover:border-black/30'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#111]' : 'border-[#A3A3A3]'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#111] rounded-full" />}
                    </div>
                    <span className="font-['IBM_Plex_Mono'] font-medium text-sm">Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-[#111]' : 'text-[#A3A3A3]'}`} strokeWidth={1.5} />
                </label>
                
                <label 
                  className={`flex items-center justify-between p-5 border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#111] bg-[#FAFAFA]' : 'border-black/10 hover:border-black/30'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#111]' : 'border-[#A3A3A3]'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-[#111] rounded-full" />}
                    </div>
                    <span className="font-['IBM_Plex_Mono'] font-medium text-sm">Thẻ Tín dụng / Ghi nợ</span>
                  </div>
                  <div className="flex gap-2">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#111]' : 'text-[#A3A3A3]'}`} strokeWidth={1.5} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5" ref={summaryRef}>
            <div className="bg-[#FAFAFA] p-8 flex flex-col gap-8 sticky top-24 border border-black/10 shadow-sm">
              <h2 className="font-['IBM_Plex_Mono'] font-medium text-[11px] uppercase tracking-widest border-b border-black/10 pb-4 text-[#666]">
                Đơn hàng của bạn ({selectedItems.length} sản phẩm)
              </h2>
              
              <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {groupedCart.map(([brandId, group]) => (
                  <div key={brandId} className="space-y-4">
                    <h3 className="font-['IBM_Plex_Mono'] font-bold text-xs uppercase tracking-widest text-[#111] border-b border-black/5 pb-2">
                      {group.brandName}
                    </h3>
                    <div className="space-y-6">
                      {group.items.map((item, idx) => (
                        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 items-center group">
                          <div className="w-20 h-24 bg-[#F5F2EE] overflow-hidden flex-shrink-0 relative border border-black/5">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-0 right-0 bg-[#111] text-white text-[10px] font-['IBM_Plex_Mono'] w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex flex-col flex-1 gap-1">
                            <span className="font-['Playfair_Display'] font-medium text-lg line-clamp-1 leading-tight">{item.name}</span>
                            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#A3A3A3] uppercase tracking-widest">
                              {item.size} / {item.color}
                            </span>
                          </div>
                          <span className="font-['IBM_Plex_Mono'] text-sm font-medium">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px w-full bg-black/10"></div>

              {/* Voucher Input */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nhập mã giảm giá..." 
                    className="h-10 rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black bg-white font-['IBM_Plex_Mono'] text-xs flex-1 uppercase"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={!!appliedVoucher}
                  />
                  {!appliedVoucher ? (
                    <Button 
                      onClick={handleApplyVoucher}
                      variant="outline" 
                      className="h-10 rounded-none border-black text-[#111] font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                      Áp dụng
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleRemoveVoucher}
                      variant="outline" 
                      className="h-10 rounded-none border-black/20 text-[#666] font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest hover:bg-black/5 transition-colors"
                    >
                      Huỷ
                    </Button>
                  )}
                </div>
                {voucherError && <span className="text-red-500 text-[10px] font-['IBM_Plex_Mono']">{voucherError}</span>}
                {appliedVoucher && <span className="text-green-600 text-[10px] font-['IBM_Plex_Mono']">Đã áp dụng mã {appliedVoucher.code}</span>}
              </div>

              <div className="h-px w-full bg-black/10"></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between font-['IBM_Plex_Mono'] text-xs text-[#666] uppercase tracking-widest">
                  <span>Tạm tính</span>
                  <span className="text-[#111]">{totalAmount.toLocaleString()}đ</span>
                </div>
                {appliedVoucher && (
                  <div className="flex items-center justify-between font-['IBM_Plex_Mono'] text-xs text-green-600 uppercase tracking-widest">
                    <span>Giảm giá ({appliedVoucher.code})</span>
                    <span>-{appliedVoucher.discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-['IBM_Plex_Mono'] text-xs text-[#666] uppercase tracking-widest">
                  <span>Phí vận chuyển</span>
                  <span className="text-[#111]">Miễn phí</span>
                </div>
                <div className="h-px w-full bg-black/10 my-2"></div>
                <div className="flex items-end justify-between">
                  <span className="font-['Playfair_Display'] text-2xl font-medium">Tổng cộng</span>
                  <span className="font-['Playfair_Display'] text-3xl font-medium">{Math.max(0, finalAmount).toLocaleString()}đ</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full h-14 mt-4 rounded-none bg-[#111] hover:bg-black text-white font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-widest transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Hoàn tất đặt hàng
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#A3A3A3] uppercase tracking-widest">
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
