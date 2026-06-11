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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAdminUsers, useUpdateUserStatus } from "@/features/admin/queries/admin.queries";

export function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Custom hook fetching real data
  const { data, isLoading, isError } = useAdminUsers({ page, limit: 10, q: searchTerm });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const toggleBan = (id: string, currentStatus: number | string) => {
    const isCurrentlyActive = currentStatus === 0 || currentStatus === "ACTIVE";
    const newStatus = isCurrentlyActive ? 1 : 0;
    updateStatus({ id, data: { status: newStatus } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users = data?.items.filter((user: any) => user.roleSlug !== "admin") || [];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-700 font-sans pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Người dùng</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý tài khoản, trạng thái và phân quyền truy cập hệ thống.
          </p>
        </div>
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email, username..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full pl-10 pr-4 rounded-full bg-background border border-border/60 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none text-foreground"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-background/60 backdrop-blur-xl border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
              <TableHead className="w-[300px] h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">Tài khoản</TableHead>
              <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">Tên đăng nhập</TableHead>
              <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">Ngày tham gia</TableHead>
              <TableHead className="h-12 font-medium text-xs uppercase tracking-wider text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="h-12 text-right pr-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <Loader2 className="size-5 animate-spin" />
                    <span className="text-sm">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-red-500/80 text-sm">
                  Không thể tải dữ liệu người dùng. Vui lòng thử lại.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                  Không tìm thấy người dùng nào phù hợp.
                </TableCell>
              </TableRow>
            ) : users.map((user: any, index: number) => {
              const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Người dùng';
              const isActive = user.status === 0 || user.status === "ACTIVE";

              return (
                <TableRow 
                  key={user.id} 
                  className={cn(
                    "group transition-colors hover:bg-muted/40 border-b border-border/40 last:border-0",
                    !isActive && "opacity-75 bg-muted/10 hover:bg-muted/20"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center text-sm font-semibold text-foreground overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-sm text-foreground truncate">{displayName}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.username}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("size-2 rounded-full", isActive ? "bg-emerald-500" : "bg-rose-500")} />
                      <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 mr-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 data-[state=open]:opacity-100">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 font-sans rounded-xl shadow-lg border-border/60">
                        <DropdownMenuItem className="text-sm cursor-pointer py-2 px-3" onClick={() => setSelectedUser(user)}>
                          <Eye className="mr-2 size-4 text-muted-foreground" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/60" />
                        <DropdownMenuItem 
                          className={cn("text-sm cursor-pointer font-medium py-2 px-3 transition-colors focus:bg-rose-500/10 focus:text-rose-600", isActive ? "text-rose-500" : "text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-600")}
                          onClick={() => toggleBan(user.id, user.status)}
                          disabled={isUpdating}
                        >
                          <ShieldBan className={cn("mr-2 size-4", isActive ? "text-rose-500/70" : "text-emerald-500/70")} /> 
                          {isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
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
        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-muted-foreground">
            Hiển thị trang {page} trên {data.metadata.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-4 h-9 border-border/60 hover:bg-muted/50 transition-colors"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Trang trước
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-4 h-9 border-border/60 hover:bg-muted/50 transition-colors"
              disabled={page >= data.metadata.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md font-sans p-0 gap-0 overflow-hidden border-border/60 shadow-xl rounded-2xl">
          {selectedUser && (
            <>
              {/* Dialog Header with subtle gradient */}
              <div className="px-6 py-8 pb-10 bg-gradient-to-br from-muted/50 to-background border-b border-border/40 relative">
                <DialogHeader className="absolute top-6 left-6 right-6 flex flex-row items-center justify-between">
                  <div>
                    <DialogTitle className="text-base font-semibold">Hồ sơ người dùng</DialogTitle>
                    <DialogDescription className="text-xs">Thông tin chi tiết tài khoản</DialogDescription>
                  </div>
                </DialogHeader>

                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="size-20 rounded-full bg-background border-2 border-border/50 flex items-center justify-center text-3xl font-medium text-foreground overflow-hidden shadow-sm">
                    {selectedUser.avatarUrl ? (
                      <img src={selectedUser.avatarUrl} alt={selectedUser.username} className="w-full h-full object-cover" />
                    ) : (
                      (selectedUser.firstName?.[0] || selectedUser.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">
                      {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.username || 'Người dùng'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Data Grid */}
              <div className="p-6 bg-background">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tên đăng nhập</p>
                    <p className="text-sm font-medium text-foreground">{selectedUser.username || 'N/A'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Số điện thoại</p>
                    <p className="text-sm font-medium text-foreground">{selectedUser.phone || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ngày tham gia</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trạng thái</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn(
                        "size-2 rounded-full",
                        (selectedUser.status === 0 || selectedUser.status === "ACTIVE") ? "bg-emerald-500" : "bg-rose-500"
                      )} />
                      <span className="text-sm font-medium text-foreground">
                        {(selectedUser.status === 0 || selectedUser.status === "ACTIVE") ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
