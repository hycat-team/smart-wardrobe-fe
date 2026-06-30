"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCustomerDetail, useGetLoyaltyAccountTransactions } from '@/features/brand-portal/queries/brand-portal.queries';
import { ArrowLeft, Mail, Phone, Calendar, Loader2, Gift, CreditCard, ShoppingBag, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddPointsDialog from '../../components/AddPointsDialog';
import GenerateClaimDialog from '../../components/GenerateClaimDialog';

export default function CustomerDetailClient() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;
  const customerId = params.customerId as string;

  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  const { data: customer, isLoading } = useGetCustomerDetail(brandId, customerId);
  const { data: transactions, isLoading: isLoadingTx } = useGetLoyaltyAccountTransactions(
    brandId, 
    customer?.loyaltyAccountId || ''
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Đang tải thông tin khách hàng...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-destructive">
        <p>Không tìm thấy khách hàng.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{customer.name}</h1>
          <p className="text-muted-foreground text-sm">ID: {customer.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!customer.loyaltyAccountId && (
            <Button variant="outline" className="rounded-full" onClick={() => setIsClaimDialogOpen(true)}>
              Tạo mã Claim
            </Button>
          )}
          <Button className="rounded-full" onClick={() => setIsPointsDialogOpen(true)}>
            <Gift className="w-4 h-4 mr-2" /> Cộng điểm
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-border bg-card shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Điện thoại</span>
                <span className="font-medium">{customer.phoneE164 || 'Chưa cập nhật'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Email</span>
                <span className="font-medium">{customer.email || 'Chưa cập nhật'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Ngày tham gia</span>
                <span className="font-medium">{customer.createdAt ? formatDate(customer.createdAt) : '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="rounded-3xl border-border bg-card shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-2">
              <CreditCard className="w-8 h-8 text-primary mb-2" />
              <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Tổng chi tiêu</span>
              <span className="text-3xl font-bold">{formatCurrency(customer.totalSpent)}</span>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border bg-card shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-2">
              <ShoppingBag className="w-8 h-8 text-primary mb-2" />
              <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Tổng đơn hàng</span>
              <span className="text-3xl font-bold">{customer.totalOrders}</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-muted p-1 rounded-2xl w-full sm:w-auto overflow-x-auto justify-start flex-nowrap shrink-0 border border-border">
          <TabsTrigger value="transactions" className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            Lịch sử điểm thưởng
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-6">
          <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Mã GD</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Loại</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Điểm</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Lý do</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!customer.loyaltyAccountId ? (
                     <TableRow>
                     <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                       Khách hàng chưa có tài khoản Loyalty.
                     </TableCell>
                   </TableRow>
                  ) : isLoadingTx ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : !transactions || transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                        <History className="w-12 h-12 opacity-50 mx-auto mb-4" />
                        Chưa có lịch sử giao dịch điểm.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium text-xs text-muted-foreground">{tx.id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                            tx.transactionType === 'earn' ? 'bg-emerald-500/10 text-emerald-600' :
                            tx.transactionType === 'redeem' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {tx.transactionType}
                          </span>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${tx.transactionType === 'earn' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {tx.transactionType === 'earn' ? '+' : '-'}{tx.points}
                        </TableCell>
                        <TableCell>{tx.reason}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{formatDate(tx.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AddPointsDialog 
        brandId={brandId} 
        open={isPointsDialogOpen} 
        onOpenChange={setIsPointsDialogOpen}
        defaultUserId={customer.userId || undefined}
        defaultPhone={customer.phoneE164 || undefined}
      />
      <GenerateClaimDialog
        brandId={brandId}
        customerId={customerId}
        open={isClaimDialogOpen}
        onOpenChange={setIsClaimDialogOpen}
      />
    </div>
  );
}
