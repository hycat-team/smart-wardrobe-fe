'use client';

import React from 'react';
import { useB2BDemoStore } from '@/lib/mock-data/b2b/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGetBrandItemDetail } from '@/features/brands/queries/user-brands.queries';

function ProductCell({ productId }: { productId: string }) {
  const { data: product } = useGetBrandItemDetail(productId);
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border">
        {product?.imageUrls?.[0] && <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />}
      </div>
      <span className="font-bold text-sm text-foreground line-clamp-2 min-w-[150px]">{product?.name || "Đang tải..."}</span>
    </div>
  );
}

export default function CustomerCareClient() {
  const { returnRequests, updateReturnRequestStatus } = useB2BDemoStore();
  const brandRequests = returnRequests.filter(r => r.brandId === 'brand_001');

  const handleUpdateStatus = (id: string, status: string) => {
    updateReturnRequestStatus(id, status);
    toast.success(`Đã cập nhật trạng thái: ${status}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Mới</span>;
      case 'UNDER_REVIEW': return <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Đang xem xét</span>;
      case 'APPROVED': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Chấp nhận</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-widest rounded-full">Từ chối</span>;
      default: return <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Yêu cầu Đổi / Trả</h1>
      </div> */}

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Mã yêu cầu / Ngày</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Sản phẩm</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Vấn đề</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brandRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">Không có yêu cầu nào.</TableCell>
              </TableRow>
            ) : brandRequests.map(req => {
              return (
                <TableRow key={req.id} className="border-border hover:bg-muted/50 transition-colors">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-foreground">{req.id}</span>
                      <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProductCell productId={req.productId} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 min-w-[200px]">
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{req.type}</span>
                      <span className="text-sm text-muted-foreground leading-snug">{req.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {req.status === 'SUBMITTED' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="rounded-full border-border hover:bg-muted font-bold uppercase tracking-widest text-[10px]" onClick={() => handleUpdateStatus(req.id, 'UNDER_REVIEW')}>
                          Xem xét
                        </Button>
                      </div>
                    ) : req.status === 'UNDER_REVIEW' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px]" onClick={() => handleUpdateStatus(req.id, 'APPROVED')}>
                          Duyệt
                        </Button>
                        <Button size="sm" variant="destructive" className="rounded-full font-bold uppercase tracking-widest text-[10px]" onClick={() => handleUpdateStatus(req.id, 'REJECTED')}>
                          Từ chối
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest">Đã xử lý</span>
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
