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

import { useAdminUsers, useAdminPosts, useAdminCatalog } from "@/features/admin/queries/admin.queries";

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
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ limit: 1 });
  const { data: postsData, isLoading: postsLoading } = useAdminPosts({ limit: 1 });
  const { data: catalogData, isLoading: catalogLoading } = useAdminCatalog();

  const totalUsers = usersData?.metadata?.totalItems || 0;
  const totalPosts = postsData?.metadata?.totalItems || 0;
  const totalCatalog = catalogData?.metadata?.totalItems || 0;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-[#111]">

      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-6 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-semibold font-medium text-[#111] leading-[1.1] uppercase">
              OVERVIEW
            </h1>
            <p className="text-[12px] text-[#666] font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              Theo dõi sức khỏe và hoạt động của nền tảng. Các thông số vận hành theo thời gian thực.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Người Dùng", value: usersLoading ? "..." : totalUsers.toLocaleString('vi-VN'), change: "Thực tế", icon: Users },
          { label: "Cộng Đồng", value: postsLoading ? "..." : totalPosts.toLocaleString('vi-VN'), change: "Thực tế", icon: Sparkles },
          { label: "Catalog", value: catalogLoading ? "..." : totalCatalog.toLocaleString('vi-VN'), change: "Thực tế", icon: TrendingUp },
          { label: "Cần Duyệt (Mock)", value: "14", change: "Alert", icon: ShieldAlert, alert: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-black/10 p-6 flex flex-col gap-6 shadow-sm relative group hover:border-black/30 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold font-bold text-[#888] uppercase tracking-[0.15em] group-hover:text-[#111] transition-colors">{stat.label}</span>
              <div className="text-[#A3A3A3] group-hover:text-[#111] transition-colors">
                <stat.icon className="size-4" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-semibold font-medium text-[#111]">{stat.value}</span>
              <span className={cn(
                "text-[9px] font-semibold font-bold uppercase tracking-widest mb-1",
                stat.alert ? "text-[#111] border-b border-[#111]" : "text-[#A3A3A3]"
              )}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white border border-black/10 p-6 shadow-sm">
          <div className="mb-8 border-b border-black/5 pb-4">
            <h3 className="font-semibold text-2xl text-[#111] mb-2">Hoạt Động Tuần</h3>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#666]">Lượt dùng AI & Lưu lượng truy cập</p>
          </div>

          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="99%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="name" stroke="#A3A3A3" fontSize={10} fontFamily="IBM Plex Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={10} fontFamily="IBM Plex Mono" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: '#111', borderRadius: '0', color: '#FFF', fontFamily: 'IBM Plex Mono', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Line type="monotone" dataKey="aiCalls" name="Lượt dùng AI" stroke="#111" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#111' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="users" name="Truy cập" stroke="#A3A3A3" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Load */}
        <div className="bg-white border border-black/10 p-6 shadow-sm flex flex-col">
          <div className="mb-8 border-b border-black/5 pb-4">
            <h3 className="font-semibold text-2xl text-[#111] mb-2">Tải Hệ Thống</h3>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#666]">Trạng thái xử lý thời gian thực</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-widest text-[#111] font-bold">
                <span>LLM Engine</span>
                <span>45%</span>
              </div>
              <div className="h-1 w-full bg-[#F8F7F5] overflow-hidden">
                <div className="h-full bg-[#111] w-[45%]" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-widest text-[#111] font-bold">
                <span>Computer Vision</span>
                <span>78%</span>
              </div>
              <div className="h-1 w-full bg-[#F8F7F5] overflow-hidden">
                <div className="h-full bg-[#666] w-[78%]" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-widest text-[#111] font-bold">
                <span>Database Query</span>
                <span>12%</span>
              </div>
              <div className="h-1 w-full bg-[#F8F7F5] overflow-hidden">
                <div className="h-full bg-[#A3A3A3] w-[12%]" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
