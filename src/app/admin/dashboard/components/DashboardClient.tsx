"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Sparkles, TrendingUp, ShieldAlert, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const data = [
  { name: "Mon", users: 4000, aiCalls: 2400 },
  { name: "Tue", users: 3000, aiCalls: 1398 },
  { name: "Wed", users: 2000, aiCalls: 9800 },
  { name: "Thu", users: 2780, aiCalls: 3908 },
  { name: "Fri", users: 1890, aiCalls: 4800 },
  { name: "Sat", users: 2390, aiCalls: 3800 },
  { name: "Sun", users: 3490, aiCalls: 4300 },
];

export function DashboardClient() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Dashboard Tổng Quan</h1>
        <p className="text-sm text-muted-foreground">Theo dõi sức khỏe và hoạt động của nền tảng Smart Wardrobe.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng số Users", value: "12,450", change: "+12%", icon: Users },
          { label: "Lượt gọi AI (Tháng)", value: "845,021", change: "+24%", icon: Sparkles },
          { label: "Doanh thu Premium", value: "245M đ", change: "+8%", icon: TrendingUp },
          { label: "Report chờ duyệt", value: "14", change: "-2", icon: ShieldAlert, alert: true },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-4 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={cn("p-2 rounded-lg", stat.alert ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary")}>
                <stat.icon className="size-5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-heading font-bold text-foreground">{stat.value}</span>
              <span className={cn(
                "text-xs font-medium mb-1 flex items-center", 
                stat.change.startsWith("+") ? "text-green-500" : stat.alert ? "text-green-500" : "text-red-500"
              )}>
                <ArrowUpRight className="size-3 mr-0.5" />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-6 space-y-1">
            <h3 className="font-heading font-semibold text-lg">Hoạt động trong tuần</h3>
            <p className="text-xs text-muted-foreground">So sánh lượng người dùng truy cập và số lượt sử dụng AI Stylist.</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E5E5' }}
                />
                <Line type="monotone" dataKey="aiCalls" name="Lượt dùng AI" stroke="#B8975A" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="users" name="Lượng truy cập" stroke="#4B5563" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Load */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-6 space-y-1">
            <h3 className="font-heading font-semibold text-lg">Tải Hệ Thống (AI)</h3>
            <p className="text-xs text-muted-foreground">Trạng thái server xử lý mô hình AI gợi ý.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tải Server LLM</span>
                <span className="font-medium text-green-500">Bình thường (45%)</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[45%] rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tải Computer Vision (Cắt nền)</span>
                <span className="font-medium text-orange-500">Hơi cao (78%)</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[78%] rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database Query Tủ Đồ</span>
                <span className="font-medium text-primary">Tốt (12%)</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[12%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
