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
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-[#111]">
      <div className="flex flex-col gap-8 pt-6 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-medium text-[#111] leading-[1.1] uppercase">
              USERS
            </h1>
            <p className="text-[12px] text-[#666] font-['IBM_Plex_Mono'] uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-black/10 pl-4">
              Quản lý tài khoản và phân quyền truy cập hệ thống.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-[#A3A3A3]" />
              <input 
                type="text" 
                placeholder="TÌM KIẾM TÊN, EMAIL..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="h-10 w-full pl-8 pr-4 bg-transparent border-b border-black/10 focus:border-[#111] text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-widest transition-all outline-none rounded-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/10 shadow-sm p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-black/10">
              <TableHead className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] uppercase tracking-[0.15em] py-4 h-auto w-[300px]">Tài khoản</TableHead>
              <TableHead className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] uppercase tracking-[0.15em] py-4 h-auto">Tên đăng nhập</TableHead>
              <TableHead className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] uppercase tracking-[0.15em] py-4 h-auto">Ngày tham gia</TableHead>
              <TableHead className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] uppercase tracking-[0.15em] py-4 h-auto">Trạng thái</TableHead>
              <TableHead className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] uppercase tracking-[0.15em] text-right py-4 h-auto">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center border-b border-black/5"><Loader2 className="animate-spin text-[#A3A3A3] mx-auto" /></TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-[#111] font-['IBM_Plex_Mono'] uppercase text-[11px] border-b border-black/5">Lỗi tải dữ liệu.</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-[#A3A3A3] font-['IBM_Plex_Mono'] uppercase text-[11px] tracking-widest border-b border-black/5">Không có dữ liệu.</TableCell></TableRow>
            ) : users.map((user: any) => {
              const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Người dùng';
              const isActive = user.status === 0 || user.status === "ACTIVE";

              return (
                <TableRow key={user.id} className={cn("border-b border-black/5 hover:bg-[#F8F7F5] transition-colors", !isActive && "opacity-60")}>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-black/5 flex items-center justify-center font-['Playfair_Display'] text-lg text-[#111] overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-['Playfair_Display'] font-medium text-base text-[#111] truncate">{displayName}</span>
                        <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] truncate uppercase tracking-wider mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-['IBM_Plex_Mono'] text-[12px] text-[#666] py-5">{user.username}</TableCell>
                  <TableCell className="font-['IBM_Plex_Mono'] text-[12px] text-[#666] py-5">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                  </TableCell>
                  <TableCell className="py-5">
                    <span className={cn("font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest font-medium border px-2 py-1", isActive ? "text-[#111] border-[#111]" : "text-[#A3A3A3] border-black/10")}>
                      {isActive ? "ACTIVE" : "BANNED"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#A3A3A3] hover:text-[#111] hover:bg-transparent rounded-none h-8 w-8">
                          <MoreHorizontal className="size-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-none border border-black/10 bg-white p-2 shadow-sm font-['IBM_Plex_Mono'] uppercase tracking-widest text-[10px]">
                        <DropdownMenuItem className="cursor-pointer py-3 px-3 rounded-none focus:bg-[#F8F7F5]" onClick={() => setSelectedUser(user)}>
                          XEM CHI TIẾT
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-black/10" />
                        <DropdownMenuItem 
                          className="cursor-pointer py-3 px-3 rounded-none focus:bg-[#F8F7F5]"
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
                  className={page <= 1 ? "pointer-events-none opacity-50 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest" : "font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest"}
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
                        className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest rounded-none border-black/10"
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
                  className={page >= data.metadata.totalPages ? "pointer-events-none opacity-50 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest" : "font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest"}
                  text="SAU"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-none border border-black/10 bg-white p-0 overflow-hidden">
          {selectedUser && (
            <div className="flex flex-col">
              <div className="p-8 border-b border-black/10 flex flex-col items-center gap-6">
                <div className="size-24 bg-black/5 flex items-center justify-center font-['Playfair_Display'] text-3xl text-[#111]">
                  {selectedUser.avatarUrl ? (
                    <img src={selectedUser.avatarUrl} alt={selectedUser.username} className="w-full h-full object-cover" />
                  ) : (
                    (selectedUser.firstName?.[0] || selectedUser.username?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-['Playfair_Display'] text-3xl font-medium text-[#111]">
                    {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.username || 'Người dùng'}
                  </h3>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-[#666]">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#A3A3A3]">USERNAME</p>
                  <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#111]">{selectedUser.username || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#A3A3A3]">ĐIỆN THOẠI</p>
                  <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#111]">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#A3A3A3]">NGÀY THAM GIA</p>
                  <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#111]">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#A3A3A3]">TRẠNG THÁI</p>
                  <span className={cn("inline-block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest font-medium border px-2 py-1 mt-1", (selectedUser.status === 0 || selectedUser.status === "ACTIVE") ? "text-[#111] border-[#111]" : "text-[#A3A3A3] border-black/10")}>
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
