import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Brand Workspace',
};

export default function BrandDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều</h1>
        <div className="bg-muted px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground rounded-full">
          Demo Data
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Người theo dõi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +15% tháng này
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lượt xem sản phẩm</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48,291</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +8% tháng này
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sản phẩm đã bán</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +22% tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Action */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 rounded-3xl">
        <div>
          <h3 className="font-bold text-amber-600 dark:text-amber-400 text-lg">Gợi ý hành động</h3>
          <p className="text-muted-foreground text-sm mt-1">Sản phẩm "Luna Structured Blazer" đang được quan tâm nhiều trong tuần qua. Hãy tạo một chiến dịch ưu đãi cho những người đã lưu sản phẩm này.</p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px] transition-colors rounded-full shadow-sm">
          Tạo Campaign
        </button>
      </div>
    </div>
  );
}
