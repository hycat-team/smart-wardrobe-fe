"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Search, Plus, MoreHorizontal, ShieldCheck, Users, Eye, EyeOff, Heart, MessageCircle, Share2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MOCK_TRENDS = [
  { 
    id: "t1", 
    title: "Y2K Revival 2026", 
    type: "official", 
    creator: "Admin System", 
    uses: 12500, 
    likes: 4500,
    comments: 320,
    shares: 890,
    status: "active", 
    date: "10/05/2026",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200"
  },
  { 
    id: "t2", 
    title: "Office Core Chic", 
    type: "official", 
    creator: "Admin System", 
    uses: 8400, 
    likes: 2100,
    comments: 150,
    shares: 420,
    status: "active", 
    date: "12/05/2026",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=200"
  },
  { 
    id: "t3", 
    title: "Eco Minimalist", 
    type: "community", 
    creator: "@eco_life", 
    uses: 5600, 
    likes: 3800,
    comments: 410,
    shares: 1200,
    status: "active", 
    date: "15/05/2026",
    image: "https://images.unsplash.com/photo-1499939667766-4afceb292d05?auto=format&fit=crop&q=80&w=200"
  },
  { 
    id: "t4", 
    title: "Dark Academia Cozy", 
    type: "community", 
    creator: "@dark_academia_vn", 
    uses: 3200, 
    likes: 1200,
    comments: 85,
    shares: 110,
    status: "hidden", 
    date: "18/05/2026",
    image: "https://images.unsplash.com/photo-1550614000-4b95d466f2c8?auto=format&fit=crop&q=80&w=200"
  },
  { 
    id: "t5", 
    title: "Street Luxe Summer", 
    type: "official", 
    creator: "Admin System", 
    uses: 15800, 
    likes: 6700,
    comments: 540,
    shares: 2100,
    status: "active", 
    date: "20/05/2026",
    image: "https://images.unsplash.com/photo-1511511450040-677116ff389e?auto=format&fit=crop&q=80&w=200"
  },
];

export function TrendsClient() {
  const router = useRouter();
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "official" | "community">("all");
  const [selectedTrend, setSelectedTrend] = useState<typeof MOCK_TRENDS[0] | null>(null);

  const filteredTrends = trends.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleVisibility = (id: string) => {
    setTrends(trends.map(t => t.id === id ? { ...t, status: t.status === "active" ? "hidden" : "active" } : t));
  };

  const removeTrend = (id: string) => {
    setTrends(trends.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Quản Lý Xu Hướng</h1>
          <p className="text-sm text-muted-foreground">Theo dõi và kiểm duyệt các Style Trends từ hệ thống và cộng đồng.</p>
        </div>
        <Button 
          onClick={() => router.push("/admin/trends/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 rounded-xl"
        >
          <Plus className="size-4 mr-2" /> Tạo Trend Mới
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo tên trend, người tạo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-secondary border-transparent focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none text-foreground"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {[{ id: "all", label: "Tất cả" }, { id: "official", label: "Official (Admin)" }, { id: "community", label: "Community" }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 sm:flex-none",
                filterType === tab.id 
                  ? "bg-primary/20 text-primary" 
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[300px]">Xu Hướng (Trend)</TableHead>
              <TableHead>Nguồn Gốc</TableHead>
              <TableHead className="text-center">Lượt Dùng AI</TableHead>
              <TableHead className="text-center">Tương Tác</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrends.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Không tìm thấy xu hướng nào phù hợp.
                </TableCell>
              </TableRow>
            ) : filteredTrends.map((trend) => (
              <TableRow key={trend.id} className={cn(trend.status === "hidden" && "opacity-60 bg-muted/30")}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img src={trend.image} alt={trend.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm">{trend.title}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{trend.date}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {trend.type === "official" ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20">
                      <ShieldCheck className="size-3" /> Official
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                      <Users className="size-3" /> Community
                    </span>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-1.5">{trend.creator}</div>
                </TableCell>
                <TableCell className="text-center font-mono text-sm font-medium">
                  {trend.uses.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Heart className="size-3 text-red-400" /> {(trend.likes / 1000).toFixed(1)}k</span>
                    <span className="flex items-center gap-1"><MessageCircle className="size-3" /> {trend.comments}</span>
                    <span className="flex items-center gap-1"><Share2 className="size-3" /> {trend.shares}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    trend.status === "active" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                  )}>
                    {trend.status === "active" ? "Đang chạy" : "Đang ẩn"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 font-sans">
                      <DropdownMenuItem 
                        className="text-xs cursor-pointer"
                        onClick={() => setSelectedTrend(trend)}
                      >
                        <Eye className="mr-2 size-3.5" /> Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-xs cursor-pointer"
                        onClick={() => toggleVisibility(trend.id)}
                      >
                        {trend.status === "active" ? (
                          <><EyeOff className="mr-2 size-3.5" /> Ẩn khỏi Feed</>
                        ) : (
                          <><Eye className="mr-2 size-3.5" /> Hiển thị lại trên Feed</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {trend.type === "community" && (
                        <DropdownMenuItem className="text-xs cursor-pointer text-primary">
                          <Crown className="mr-2 size-3.5" /> Chuyển thành Official
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-xs cursor-pointer text-red-500 font-medium hover:text-red-600 focus:text-red-600"
                        onClick={() => removeTrend(trend.id)}
                      >
                        Xóa Trend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTrend} onOpenChange={() => setSelectedTrend(null)}>
        <DialogContent className="sm:max-w-md font-sans bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold text-foreground">Chi tiết Xu Hướng</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Thông tin hiệu suất của xu hướng trên nền tảng.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTrend && (
            <div className="space-y-6 py-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                <img src={selectedTrend.image} alt={selectedTrend.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  {selectedTrend.type === "official" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                      <ShieldCheck className="size-3.5" /> Official
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                      <Users className="size-3.5" /> Community
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-heading text-foreground">{selectedTrend.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Đăng bởi <span className="font-medium text-foreground">{selectedTrend.creator}</span> vào ngày {selectedTrend.date}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-xl flex flex-col gap-1 border border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lượt dùng AI</span>
                  <span className="text-2xl font-bold font-mono text-primary">{selectedTrend.uses.toLocaleString()}</span>
                </div>
                
                <div className="bg-secondary/50 p-4 rounded-xl flex flex-col justify-center gap-3 border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><Heart className="size-4 text-red-400" /> Lượt tim</span>
                    <span className="font-mono font-medium text-foreground">{(selectedTrend.likes / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><MessageCircle className="size-4" /> Bình luận</span>
                    <span className="font-mono font-medium text-foreground">{selectedTrend.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}


