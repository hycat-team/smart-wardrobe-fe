'use client';

import React, { useState } from 'react';
import { useGetAdminBrands, useUpdateBrandStatusAdmin } from '@/features/brand-portal/queries/brand-portal.queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Building2, Store, Clock, MoreHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandStatus } from '@/features/brand-portal/types';
import CreateBrandAdminDialog from './CreateBrandAdminDialog';
import { Plus } from 'lucide-react';

export default function AdminBrandApprovalClient() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const limit = 10;

  const { data: brandsData, isLoading } = useGetAdminBrands({
    page,
    limit,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    q: searchQuery || undefined
  });

  const updateStatusMutation = useUpdateBrandStatusAdmin();
  const brands = brandsData?.items || [];
  const metadata = brandsData?.metadata;

  const handleApprove = (id: string) => {
    updateStatusMutation.mutate({ brandId: id, status: 'active' });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ brandId: id, status: 'rejected' });
  };

  const handleSuspend = (id: string) => {
    updateStatusMutation.mutate({ brandId: id, status: 'suspended' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Hoạt động</Badge>;
      case 'pending_review':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-200">Chờ duyệt</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200">Đình chỉ</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-gray-500">Đã từ chối</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Lưu trữ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Phê duyệt Thương hiệu</h1>
            <p className="text-gray-500">Quản lý và xét duyệt các yêu cầu đăng ký đối tác (Brand) trên Closy.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm thương hiệu..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset page on search
                }}
              />
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm shrink-0">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)} 
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-md h-9 px-4 text-sm font-medium mr-1"
              >
                <Plus className="size-4 mr-1.5" /> Tạo thương hiệu
              </Button>
              <button
                onClick={() => { setFilterStatus('all'); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filterStatus === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => { setFilterStatus('pending_review'); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filterStatus === 'pending_review' ? 'bg-amber-50 text-amber-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Chờ duyệt
              </button>
              <button
                onClick={() => { setFilterStatus('active'); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filterStatus === 'active' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Đang hoạt động
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px]">Thương hiệu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-12 w-[250px] rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-[400px] text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <Store className="size-12 text-gray-300" strokeWidth={1} />
                        <p>Không tìm thấy thương hiệu nào.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow key={brand.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="size-12 rounded-lg border border-gray-100">
                            <AvatarImage src={brand.logoUrl} alt={brand.name} className="object-cover" />
                            <AvatarFallback className="rounded-lg bg-gray-50 text-gray-400">
                              <Building2 className="size-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{brand.name}</span>
                            <span className="text-sm text-gray-500 truncate max-w-[200px]">@{brand.slug}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(brand.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-2 size-4" />
                          {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {brand.status === 'pending_review' ? (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => handleReject(brand.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <X className="size-4 mr-1" /> Từ chối
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleApprove(brand.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <Check className="size-4 mr-1" /> Duyệt
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="size-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              {brand.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleSuspend(brand.id)} className="text-red-600">
                                  Đình chỉ hoạt động
                                </DropdownMenuItem>
                              )}
                              {brand.status === 'suspended' && (
                                <DropdownMenuItem onClick={() => handleApprove(brand.id)} className="text-emerald-600">
                                  Khôi phục hoạt động
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {metadata && metadata.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-500">
                  Hiển thị <span className="font-medium">{(metadata.page - 1) * limit + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(metadata.page * limit, metadata.totalItems)}</span> trong{' '}
                  <span className="font-medium">{metadata.totalItems}</span> kết quả
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={metadata.page === 1}
                  >
                    <ChevronLeft className="size-4 mr-1" /> Trước
                  </Button>
                  <div className="text-sm font-medium px-2">
                    {metadata.page} / {metadata.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
                    disabled={metadata.page === metadata.totalPages}
                  >
                    Sau <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateBrandAdminDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
}
