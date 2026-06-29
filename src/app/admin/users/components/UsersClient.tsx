"use client";
import { useState } from "react";
import { Search, MoreHorizontal, Loader2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAdminUsers, useUpdateUserStatus } from "@/features/admin/queries/admin.queries";
import Image from "next/image";

export function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading, isError } = useAdminUsers({ page, limit: 10, q: searchTerm });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const toggleBan = (id: string, currentStatus: number | string) => {
    const isCurrentlyActive = currentStatus === 0 || currentStatus === "ACTIVE";
    const newStatus = isCurrentlyActive ? 1 : 0;
    updateStatus({ id, data: { status: newStatus } });
  };

  const users = data?.items.filter((user: any) => user.roleSlug !== "admin") || [];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-foreground">
      <div className="flex flex-col gap-8 pt-6 border-b border-border pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* <h1 className="text-5xl md:text-6xl font-semibold font-medium text-foreground leading-[1.1] uppercase">
              Người dùng
            </h1> */}
            <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-border pl-4">
              Quản lý tài khoản và phân quyền truy cập hệ thống.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="TÌM KIẾM TÊN, EMAIL..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="h-10 w-full pl-10 pr-4 bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-[11px] font-semibold uppercase tracking-widest transition-all outline-none rounded-2xl text-foreground placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto w-[300px]">Tài khoản</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Tên đăng nhập</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Ngày tham gia</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Trạng thái</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] text-right py-4 h-auto">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center border-b border-border"><Loader2 className="animate-spin text-muted-foreground mx-auto" /></TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-foreground font-semibold uppercase text-[11px] border-b border-border">Lỗi tải dữ liệu.</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-semibold uppercase text-[11px] tracking-widest border-b border-border">Không có dữ liệu.</TableCell></TableRow>
            ) : users.map((user: any) => {
              const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Người dùng';
              const isActive = user.status === 0 || user.status === "ACTIVE";

              return (
                <TableRow key={user.id} className={cn("border-b border-border hover:bg-muted/50 transition-colors", !isActive && "opacity-60")}>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-muted flex items-center justify-center font-semibold text-lg text-foreground overflow-hidden shrink-0 rounded-full">
                        {user.avatarUrl ? (
                          <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold font-medium text-base text-foreground truncate">{displayName}</span>
                        <span className="font-semibold text-[10px] text-muted-foreground truncate uppercase tracking-wider mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-[12px] text-muted-foreground py-5">{user.username}</TableCell>
                  <TableCell className="font-semibold text-[12px] text-muted-foreground py-5">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                  </TableCell>
                  <TableCell className="py-5">
                    <span className={cn("font-semibold text-[10px] uppercase tracking-widest font-medium border px-3 py-1 rounded-full", isActive ? "text-foreground border-foreground bg-foreground/5" : "text-muted-foreground border-border bg-muted/50")}>
                      {isActive ? "ACTIVE" : "BANNED"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full h-8 w-8 shadow-sm">
                          <MoreHorizontal className="size-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-border bg-card p-2 shadow-lg font-semibold uppercase tracking-widest text-[10px]">
                        <DropdownMenuItem className="cursor-pointer py-3 px-3 rounded-xl focus:bg-muted/50" onClick={() => setSelectedUser(user)}>
                          XEM CHI TIẾT
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-black/10" />
                        <DropdownMenuItem
                          className="cursor-pointer py-3 px-3 rounded-xl focus:bg-muted/50"
                          onClick={() => toggleBan(user.id, user.status)}
                          disabled={isUpdating}
                        >
                          {isActive ? "KHÓA TÀI KHOẢN" : "MỞ KHÓA"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {data?.metadata && data.metadata.totalPages > 1 && (
          <Pagination className="mt-16 pb-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((p) => p - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50 font-semibold text-[11px] uppercase tracking-widest" : "font-semibold text-[11px] uppercase tracking-widest"}
                  text="TRƯỚC"
                />
              </PaginationItem>

              {[...Array(data.metadata.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === data.metadata.totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                        className="font-semibold text-[11px] uppercase tracking-widest rounded-full border-border"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < data.metadata.totalPages) setPage((p) => p + 1);
                  }}
                  className={page >= data.metadata.totalPages ? "pointer-events-none opacity-50 font-semibold text-[11px] uppercase tracking-widest" : "font-semibold text-[11px] uppercase tracking-widest"}
                  text="SAU"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border border-border bg-card p-0 overflow-hidden shadow-xl">
          {selectedUser && (
            <div className="flex flex-col">
              <div className="p-8 border-b border-border flex flex-col items-center gap-6">
                <div className="size-24 bg-muted flex items-center justify-center font-semibold text-3xl text-foreground rounded-full overflow-hidden">
                  {selectedUser.avatarUrl ? (
                    <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={selectedUser.avatarUrl} alt={selectedUser.username} className="w-full h-full object-cover" />
                  ) : (
                    (selectedUser.firstName?.[0] || selectedUser.username?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-3xl font-medium text-foreground">
                    {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.username || 'Người dùng'}
                  </h3>
                  <p className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="p-8 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">USERNAME</p>
                  <p className="font-semibold text-[12px] text-foreground">{selectedUser.username || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">ĐIỆN THOẠI</p>
                  <p className="font-semibold text-[12px] text-foreground">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">NGÀY THAM GIA</p>
                  <p className="font-semibold text-[12px] text-foreground">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">TRẠNG THÁI</p>
                  <span className={cn("inline-block font-semibold text-[10px] uppercase tracking-widest font-medium border px-3 py-1 mt-1 rounded-full", (selectedUser.status === 0 || selectedUser.status === "ACTIVE") ? "text-foreground border-foreground bg-foreground/5" : "text-muted-foreground border-border bg-muted/50")}>
                    {(selectedUser.status === 0 || selectedUser.status === "ACTIVE") ? "ACTIVE" : "BANNED"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
