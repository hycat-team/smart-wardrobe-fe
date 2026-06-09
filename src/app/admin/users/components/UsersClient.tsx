"use client";
import { useState } from "react";
import { Search, MoreHorizontal, ShieldBan, Crown, Eye } from "lucide-react";
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
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: "u1", name: "Lê Cẩm Lan", email: "lan.le@example.com", isPremium: false, joinDate: "2026-01-01", status: "active" },
  { id: "u2", name: "VIP Style", email: "vip@smartwardrobe.com", isPremium: true, joinDate: "2026-02-15", status: "active" },
  { id: "u3", name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", isPremium: false, joinDate: "2026-05-10", status: "banned" },
  { id: "u4", name: "Trần Thị B", email: "tranb_fashion@yahoo.com", isPremium: true, joinDate: "2025-11-20", status: "active" },
  { id: "u5", name: "Eco Life", email: "eco.life@green.vn", isPremium: false, joinDate: "2026-04-05", status: "active" },
];

export function UsersClient() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBan = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "banned" : "active" } : u));
  };

  const togglePremium = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isPremium: !u.isPremium } : u));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Quản Lý Users</h1>
          <p className="text-sm text-muted-foreground">Xem, tìm kiếm và quản lý quyền truy cập của người dùng nền tảng.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full pl-9 pr-4 rounded-xl bg-secondary border-transparent focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none text-foreground"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[250px]">Người dùng</TableHead>
              <TableHead>Loại tài khoản</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : filteredUsers.map((user) => (
              <TableRow key={user.id} className={cn(user.status === "banned" && "opacity-60 bg-muted/30")}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.isPremium ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      <Crown className="size-3" /> Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-muted-foreground text-xs font-medium border border-border">
                      Free Plan
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{user.joinDate}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    user.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {user.status === "active" ? "Hoạt động" : "Đã khóa"}
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
                      <DropdownMenuItem className="text-xs cursor-pointer"><Eye className="mr-2 size-3.5" /> Xem chi tiết</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-xs cursor-pointer"
                        onClick={() => togglePremium(user.id)}
                      >
                        <Crown className="mr-2 size-3.5 text-primary" /> {user.isPremium ? "Hạ cấp về Free" : "Nâng cấp Premium"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className={cn("text-xs cursor-pointer font-medium", user.status === "active" ? "text-red-500" : "text-green-500")}
                        onClick={() => toggleBan(user.id)}
                      >
                        <ShieldBan className="mr-2 size-3.5" /> {user.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
