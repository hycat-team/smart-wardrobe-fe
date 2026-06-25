'use client';

import React from 'react';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { mockProducts } from '@/lib/mock-data/b2b';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CustomerCareClient() {
  const { returnRequests, updateReturnRequestStatus } = useB2BDemoStore();
  const brandRequests = returnRequests.filter(r => r.brandId === 'brand_001');

  const handleUpdateStatus = (id: string, status: string) => {
    updateReturnRequestStatus(id, status);
    toast.success(`Đã cập nhật trạng thái: ${status}`);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SUBMITTED': return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest">Mới</span>;
      case 'UNDER_REVIEW': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest">Đang xem xét</span>;
      case 'APPROVED': return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest">Chấp nhận</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest">Từ chối</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Yêu cầu Đổi / Trả</h1>
      </div>

      <div className="bg-white border border-black/10 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-black/10 hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Mã yêu cầu / Ngày</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Sản phẩm</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Vấn đề</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Trạng thái</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brandRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-black/50 italic">Không có yêu cầu nào.</TableCell>
              </TableRow>
            ) : brandRequests.map(req => {
              const product = mockProducts.find(p => p.id === req.productId);
              return (
                <TableRow key={req.id} className="border-black/10">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm">{req.id}</span>
                      <span className="text-xs text-black/50">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F5F2EE] overflow-hidden shrink-0">
                        <img src={product?.imageUrls[0]} alt={product?.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-sm line-clamp-2 min-w-[150px]">{product?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 min-w-[200px]">
                      <span className="text-xs font-bold text-black uppercase tracking-wider">{req.type}</span>
                      <span className="text-sm text-black/80">{req.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {req.status === 'SUBMITTED' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="rounded-none border-black hover:bg-black hover:text-white" onClick={() => handleUpdateStatus(req.id, 'UNDER_REVIEW')}>
                          Xem xét
                        </Button>
                      </div>
                    ) : req.status === 'UNDER_REVIEW' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" className="rounded-none bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(req.id, 'APPROVED')}>
                          Duyệt
                        </Button>
                        <Button size="sm" variant="destructive" className="rounded-none" onClick={() => handleUpdateStatus(req.id, 'REJECTED')}>
                          Từ chối
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-black/40 font-bold uppercase tracking-widest">Đã xử lý</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
