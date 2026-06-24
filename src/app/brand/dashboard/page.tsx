import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Brand Workspace',
};

export default function BrandDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="bg-[#F5F2EE] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black/50">
          Demo Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-none border-black/10 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-black/60">Người theo dõi</CardTitle>
            <Users className="h-4 w-4 text-black/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +15% tháng này
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-none border-black/10 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-black/60">Lượt xem sản phẩm</CardTitle>
            <Eye className="h-4 w-4 text-black/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48,291</div>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +8% tháng này
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-none border-black/10 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-black/60">Sản phẩm đã bán</CardTitle>
            <ShoppingBag className="h-4 w-4 text-black/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +22% tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Action */}
      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h3 className="font-bold text-[#B5952F] text-lg">Gợi ý hành động</h3>
          <p className="text-black/70 text-sm mt-1">Sản phẩm "Luna Structured Blazer" đang được quan tâm nhiều trong tuần qua. Hãy tạo một chiến dịch ưu đãi cho những người đã lưu sản phẩm này.</p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold uppercase tracking-widest text-xs transition-colors">
          Tạo Campaign
        </button>
      </div>
    </div>
  );
}
