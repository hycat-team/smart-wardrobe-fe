'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { mockProducts } from '@/lib/mock-data/b2b';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, UploadCloud, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

interface ReturnRequestClientProps {
  orderId: string;
}

function ReturnRequestForm({ orderId }: ReturnRequestClientProps) {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { orders, submitReturnRequest } = useB2BDemoStore();
  const order = orders.find(o => o.id === orderId);
  const orderItem = order?.items.find(i => i.productId === productId);
  const product = mockProducts.find(p => p.id === productId);

  const [type, setType] = useState('SIZE_EXCHANGE');
  const [reason, setReason] = useState('');
  const [preferredResolution, setPreferredResolution] = useState('');
  const [images, setImages] = useState<string[]>([]);

  if (!order || !orderItem || !product) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Không tìm thấy thông tin sản phẩm hoặc đơn hàng.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert all selected files to base64
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Ảnh ${file.name} vượt quá 5MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !preferredResolution) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    submitReturnRequest({
      orderId,
      brandId: order.brandId,
      userId: order.userId,
      productId: product.id,
      type,
      reason,
      preferredResolution,
      priority: 'NORMAL',
      images
    } as any);

    toast.success('Gửi yêu cầu thành công');
    router.push('/profile/purchases');
  };

  return (
    <div className="flex-1 bg-background text-foreground min-h-screen pb-24">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/profile/purchases" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 uppercase tracking-widest transition-colors">
          <ChevronLeft className="w-4 h-4" /> Quay lại đơn hàng
        </Link>
        
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Yêu cầu Đổi/Trả</h1>
        <p className="text-muted-foreground mb-10">Mã đơn: {orderId}</p>

        <div className="flex gap-4 p-4 border border-border bg-muted/50 rounded-3xl mb-10">
          <div className="w-20 aspect-[3/4] bg-secondary/20 rounded-2xl overflow-hidden flex-shrink-0">
            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="font-bold text-sm">{product.name}</span>
            <div className="text-xs text-muted-foreground mt-1">
              Size: <span className="font-bold text-foreground">{orderItem.size}</span> | Màu: <span className="font-bold text-foreground">{orderItem.color}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Loại yêu cầu</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'SIZE_EXCHANGE', label: 'Đổi kích cỡ / màu sắc' },
                { id: 'DEFECTIVE', label: 'Sản phẩm lỗi / Hư hỏng' },
                { id: 'RETURN', label: 'Trả hàng & Hoàn tiền' },
                { id: 'OTHER', label: 'Khác' }
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setType(opt.id)}
                  className={`p-4 border rounded-2xl cursor-pointer font-bold text-sm transition-all ${type === opt.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary/50'}`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Lý do chi tiết</label>
            <Textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vui lòng mô tả chi tiết vấn đề..."
              className="min-h-[120px] rounded-2xl border-border focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Phương án mong muốn</label>
            <Input 
              value={preferredResolution}
              onChange={(e) => setPreferredResolution(e.target.value)}
              placeholder="VD: Đổi sang size L"
              className="h-12 rounded-2xl border-border focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Hình ảnh minh hoạ (Tùy chọn)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <div 
              className="border-2 border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground/80">Kéo thả hoặc click để tải ảnh lên</span>
              <span className="text-xs text-muted-foreground">Hỗ trợ JPG, PNG (Tối đa 5MB)</span>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square border border-border rounded-xl overflow-hidden group">
                    <img src={img} alt="Uploaded preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest mt-4 shadow-sm">
            Gửi yêu cầu
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ReturnRequestClient(props: ReturnRequestClientProps) {
  return (
    <Suspense fallback={<div className="flex-1 min-h-[50vh] flex items-center justify-center">Đang tải...</div>}>
      <ReturnRequestForm {...props} />
    </Suspense>
  );
}
