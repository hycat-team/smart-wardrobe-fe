"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCustomers } from '@/features/brand-portal/queries/brand-portal.queries';
import { Search, Mail, Phone, Plus, Gift, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CreateOfflineCustomerDialog from './CreateOfflineCustomerDialog';
import AddPointsDialog from './AddPointsDialog';

export default function CustomersClient() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOfflineDialogOpen, setIsOfflineDialogOpen] = useState(false);
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  
  // Basic debounce
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: users, isLoading } = useGetCustomers(brandId, debouncedSearch);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-card p-3 rounded-2xl border border-border w-full sm:w-auto">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên, email, sđt..."
              className="pl-9 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="rounded-full w-full sm:w-auto" onClick={() => setIsOfflineDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Thêm khách offline
          </Button>
          <Button className="rounded-full w-full sm:w-auto" onClick={() => setIsPointsDialogOpen(true)}>
            <Gift className="w-4 h-4 mr-2" /> Cộng điểm
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Khách hàng</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Liên hệ</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Tổng chi tiêu</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-center">Đơn hàng</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Lần cuối mua</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : !users || users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                    Không tìm thấy khách hàng nào.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="group cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push(`/brand/${brandId}/customers/${user.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                          {user.userAvatarUrl ? (
                            <img src={user.userAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                              {((user.userFullName || user.customerName || 'K')[0]).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {user.userFullName || user.customerName || 'Khách hàng'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.userId ? `User ID: ${user.userId.slice(0, 8)}...` : 'Khách Offline'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        {user.phoneE164 && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {user.phoneE164}</div>}
                        {user.externalCustomerCode && <div className="flex items-center gap-1.5"><span className="font-bold">Mã:</span> {user.externalCustomerCode}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      -
                    </TableCell>
                    <TableCell className="text-center">
                      -
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('vi-VN') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="rounded-full">
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateOfflineCustomerDialog 
        brandId={brandId} 
        open={isOfflineDialogOpen} 
        onOpenChange={setIsOfflineDialogOpen} 
      />
      <AddPointsDialog 
        brandId={brandId} 
        open={isPointsDialogOpen} 
        onOpenChange={setIsPointsDialogOpen} 
      />
    </div>
  );
}
