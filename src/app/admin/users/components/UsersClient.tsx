"use client";
import { useState } from "react";
import { Search, MoreHorizontal, ShieldBan, Eye, Loader2 } from "lucide-react";
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
import { useAdminUsers, useUpdateUserStatus } from "@/features/admin/queries/admin.queries";

export function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  
  // Custom hook fetching real data
  const { data, isLoading, isError } = useAdminUsers({ page, limit: 10, q: searchTerm });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const toggleBan = (id: string, currentStatus: string) => {
    // Assuming backend enums are ACTIVE and BANNED
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    updateStatus({ id, data: { status: newStatus } });
  };

  const users = data?.items || [];

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
            placeholder="Tìm theo tên, email, username..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
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
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Đang tải dữ liệu...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                  Lỗi khi tải dữ liệu người dùng.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : users.map((user: any) => {
              const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Người dùng';
              const isActive = user.status === "ACTIVE";

              return (
                <TableRow key={user.id} className={cn(!isActive && "opacity-60 bg-muted/30")}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground overflow-hidden">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{displayName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {isActive ? "Hoạt động" : "Đã khóa"}
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className={cn("text-xs cursor-pointer font-medium", isActive ? "text-red-500" : "text-green-500")}
                          onClick={() => toggleBan(user.id, user.status)}
                          disabled={isUpdating}
                        >
                          <ShieldBan className="mr-2 size-3.5" /> {isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {data?.metadata && data.metadata.totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Trang trước
          </Button>
          <div className="flex items-center text-sm px-2 text-muted-foreground">
            {page} / {data.metadata.totalPages}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page >= data.metadata.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
