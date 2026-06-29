"use client";
import { useState, useRef } from "react";
import { Search, Plus, Edit, Trash2, X, Upload } from "lucide-react";
import { useAdminCatalog, useDeleteSystemWardrobeItem, useUpdateSystemWardrobeItem } from "@/features/admin/queries/admin.queries";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

import { BatchUploadModal } from "./BatchUploadModal";
import { ItemEditDrawer } from "./ItemEditDrawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

export function SystemWardrobeClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminCatalog({ q: searchTerm, page, limit: 20 });

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteSystemWardrobeItem();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const items = data?.items || [];

  useGSAP(() => {
    if (items.length === 0) return;

    gsap.from(".catalog-row", {
      y: 10,
      opacity: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });
  }, { dependencies: [items], scope: containerRef });

  const handleDelete = () => {
    if (deletingId) {
      deleteItem(deletingId, {
        onSuccess: () => setDeletingId(null)
      });
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-foreground">
      {/* Top Header Control Room Style */}
      <div className="flex flex-col gap-8 pt-6 border-b border-border pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            {/* <div className="flex items-center gap-3 text-primary font-semibold text-xs uppercase tracking-widest mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              System.Catalog_Active
            </div> */}
            {/* <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-[1.1] uppercase">
              Dữ liệu tủ đồ
            </h1> */}
            <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-border pl-4">
              Quản lý cơ sở dữ liệu chính của các món đồ trong tủ quần áo. Quy trình kiểm duyệt nghiêm ngặt đang được áp dụng.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="QUERY.ITEMS..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="h-10 w-full pl-10 pr-4 bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-[11px] font-semibold uppercase tracking-widest transition-all outline-none rounded-2xl text-foreground placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsBatchUploadOpen(true)}
              className="h-10 px-6 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-[11px] uppercase tracking-widest rounded-full shadow-sm"
            >
              <Upload className="size-4" /> Tải lên hàng loạt
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Tổng số bản ghi: <strong className="text-foreground">{items.length}</strong></span>
          <span>Trạng thái: <strong className="text-primary">Online</strong></span>
        </div>
      </div>

      {/* Brutalist Data Table */}

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-hidden w-full">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_2fr_1.5fr_1fr_120px] gap-4 p-4 border-b border-gray-300 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-gray-50">
          <div>Visual</div>
          <div>Identifier</div>
          <div>Classification</div>
          <div>Properties</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground font-semibold text-[11px] uppercase tracking-widest">
              Đang tải dữ liệu...
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-foreground font-semibold text-[11px] uppercase tracking-widest">
              Lỗi: Không thể kết nối với kho dữ liệu.
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-semibold text-[11px] uppercase tracking-widest">
              Không tìm thấy bản ghi nào khớp với truy vấn hiện tại.
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="catalog-row grid grid-cols-[80px_2fr_1.5fr_1fr_120px] gap-4 p-4 items-center hover:bg-muted/50 transition-colors group">
                {/* Visual */}
                <div className="size-16 bg-muted relative overflow-hidden group-hover:border-primary transition-colors rounded-2xl">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt="Item" fill sizes="64px" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-all duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold text-muted-foreground uppercase">N/A</div>
                  )}
                </div>

                {/* Identifier */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-semibold text-base font-medium text-foreground truncate uppercase" title={item.name || item.title || [item.category?.name || item.category || item.type, item.color, item.material].filter(Boolean).join(' - ') || 'Sản phẩm'}>
                    {item.name || item.title || [item.category?.name || item.category || item.type, item.color, item.material].filter(Boolean).join(' - ') || 'Sản phẩm'}
                  </span>
                  <span className="font-semibold text-[10px] text-muted-foreground truncate uppercase tracking-widest">ID: {item.id}</span>
                </div>

                {/* Classification */}
                <div className="flex flex-col gap-1">
                  <span className="inline-block w-fit px-2 py-1 bg-muted/50 border border-border text-foreground font-semibold text-[10px] uppercase tracking-widest rounded-full">
                    {item.category ? (typeof item.category === 'string' ? item.category : item.category.name) : (item.type || 'UNKNOWN')}
                  </span>
                </div>

                {/* Properties */}
                <div className="flex flex-col gap-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest min-w-0">
                  <span className="truncate" title={`C: ${item.color || '--'}`}>C: {item.color || '--'}</span>
                  <span className="truncate" title={`M: ${item.material || '--'}`}>M: {item.material || '--'}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                    title="Edit Record"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="size-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                    title="Purge Record"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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

      {/* Delete Confirmation Modal (Brutalist) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md p-8 shadow-xl rounded-3xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-semibold text-2xl text-foreground uppercase tracking-tight mb-2">Xóa dữ liệu</h2>
            <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-widest leading-relaxed mb-8">
              Thao tác này sẽ xóa vĩnh viễn bản ghi được chọn khỏi danh mục hệ thống. Thao tác này không thể hoàn tác.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 border border-border text-foreground font-semibold text-[11px] uppercase tracking-widest hover:bg-muted transition-colors rounded-full"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-destructive text-destructive-foreground font-semibold text-[11px] uppercase tracking-widest hover:bg-destructive/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-full"
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-components */}
      <BatchUploadModal
        isOpen={isBatchUploadOpen}
        onClose={() => setIsBatchUploadOpen(false)}
      />

      <ItemEditDrawer
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
      />
    </div>
  );
}
