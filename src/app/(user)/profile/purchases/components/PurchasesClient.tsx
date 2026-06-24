'use client';

import React from 'react';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { mockBrands, mockProducts } from '@/lib/mock-data/b2b';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PurchasesClient() {
  const { orders, returnRequests } = useB2BDemoStore();

  const getOrderStatusDisplay = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="text-orange-600 font-bold uppercase tracking-widest text-xs">Chờ xử lý</span>;
      case 'DELIVERED': return <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Đã giao hàng</span>;
      default: return <span className="text-black/50 font-bold uppercase tracking-widest text-xs">{status}</span>;
    }
  };

  const getReturnStatusDisplay = (status: string) => {
    switch(status) {
      case 'SUBMITTED': return 'Chờ duyệt';
      case 'UNDER_REVIEW': return 'Đang xem xét';
      case 'APPROVED': return 'Đã chấp nhận';
      case 'REJECTED': return 'Đã từ chối';
      case 'RESOLVED': return 'Đã hoàn tất';
      default: return status;
    }
  };

  return (
    <div className="flex-1 bg-white text-black min-h-screen pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-10">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#FAFAFA] border border-black/10">
            <p className="text-black/60 mb-4">Bạn chưa có đơn hàng nào.</p>
            <Link href="/community">
              <Button className="rounded-none bg-black text-white font-bold uppercase tracking-widest">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map(order => {
              const brand = mockBrands.find(b => b.id === order.brandId);
              
              return (
                <div key={order.id} className="border border-black/10 flex flex-col">
                  {/* Order Header */}
                  <div className="bg-[#FAFAFA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm uppercase tracking-widest">{brand?.name}</span>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <span className="text-xs text-black/50 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <span className="text-xs text-black/40">Mã đơn: {order.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {getOrderStatusDisplay(order.status)}
                      <span className="font-bold text-lg">{order.totalAmount.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 flex flex-col gap-6">
                    {order.items.map((item, idx) => {
                      const product = mockProducts.find(p => p.id === item.productId);
                      const returnReq = returnRequests.find(r => r.orderId === order.id && r.productId === item.productId);
                      
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-black/5 last:border-0 last:pb-0">
                          <div className="flex gap-4">
                            <div className="w-20 sm:w-24 aspect-[3/4] bg-[#F5F2EE] overflow-hidden flex-shrink-0">
                              <img src={product?.imageUrls[0]} alt={product?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                              <span className="font-bold text-sm">{product?.name}</span>
                              <div className="text-xs text-black/60 mt-1">
                                Size: <span className="font-bold text-black">{item.size}</span> | Màu: <span className="font-bold text-black">{item.color}</span>
                              </div>
                              <span className="text-sm font-bold mt-2">{(item.price * item.quantity).toLocaleString()}đ</span>
                              <span className="text-xs text-black/40 mt-1">SL: {item.quantity}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                            {returnReq ? (
                              <div className="bg-[#F5F2EE] px-4 py-2 flex flex-col gap-1 items-start sm:items-end w-full sm:w-auto">
                                <span className="text-xs font-bold uppercase tracking-widest text-black/50">Trạng thái đổi/trả</span>
                                <span className="text-sm font-bold text-orange-600">{getReturnStatusDisplay(returnReq.status)}</span>
                              </div>
                            ) : (
                              <Link href={`/returns/request/${order.id}?productId=${item.productId}`} className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto rounded-none border-black hover:bg-black hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                                  Yêu cầu Đổi/Trả
                                </Button>
                              </Link>
                            )}
                            <Button variant="outline" className="w-full sm:w-auto rounded-none border-black/20 hover:bg-black hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                              Thêm vào Tủ đồ
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
