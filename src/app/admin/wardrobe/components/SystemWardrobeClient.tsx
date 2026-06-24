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
    <div ref={containerRef} className="min-h-screen bg-white text-black font-sans selection:bg-green-500 selection:text-white pb-24">
      {/* Top Header Control Room Style */}
      <div className="border-b border-gray-200 bg-gray-50 p-6 lg:p-10 sticky top-0 z-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-green-600 font-mono text-xs uppercase tracking-widest mb-4">
              <span className="flex h-2 w-2 rounded-none bg-green-500 animate-pulse"></span>
              System.Catalog_Active
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tighter uppercase text-black">
              Catalog Data
            </h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest max-w-lg">
              Manage the master database of wardrobe items. Strict moderation protocol enabled.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input 
                type="text" 
                placeholder="QUERY.ITEMS..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="h-12 w-full pl-12 pr-4 bg-white border border-gray-300 focus:border-green-500 text-black font-mono text-xs uppercase tracking-widest transition-colors outline-none rounded-none placeholder:text-gray-400"
              />
            </div>
            <button 
              onClick={() => setIsBatchUploadOpen(true)}
              className="h-12 px-6 flex items-center gap-2 bg-black text-white hover:bg-green-500 hover:text-black transition-colors font-mono text-xs uppercase tracking-widest font-bold rounded-none"
            >
              <Upload className="size-4" /> Batch Upload
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
          <span>Total Records: <strong className="text-black">{items.length}</strong></span>
          <span>Status: <strong className="text-green-600">Online</strong></span>
        </div>
      </div>

      {/* Brutalist Data Table */}
      <div className="p-6 lg:p-10">
        <div className="w-full border border-gray-300 bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_2fr_1.5fr_1fr_120px] gap-4 p-4 border-b border-gray-300 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 bg-gray-50">
            <div>Visual</div>
            <div>Identifier</div>
            <div>Classification</div>
            <div>Properties</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-12 text-center text-green-600 font-mono text-xs uppercase tracking-widest">
                Fetching Datasets...
              </div>
            ) : isError ? (
              <div className="p-12 text-center text-red-500 font-mono text-xs uppercase tracking-widest">
                ERR: Failed to connect to datastore.
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">
                No records match the current query.
              </div>
            ) : (
              items.map((item: any) => (
                <div key={item.id} className="catalog-row grid grid-cols-[80px_2fr_1.5fr_1fr_120px] gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
                  {/* Visual */}
                  <div className="size-16 bg-gray-100 border border-gray-300 relative overflow-hidden group-hover:border-black transition-colors">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="Item" fill sizes="64px" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-all duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-gray-400 uppercase">N/A</div>
                    )}
                  </div>
                  
                  {/* Identifier */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-heading text-lg font-bold text-black truncate uppercase tracking-tight">{item.name || item.title || 'UNNAMED_ENTITY'}</span>
                    <span className="font-mono text-[10px] text-gray-500 truncate uppercase tracking-widest">ID: {item.id}</span>
                  </div>

                  {/* Classification */}
                  <div className="flex flex-col gap-1">
                    <span className="inline-block w-fit px-2 py-1 bg-gray-200 text-gray-600 font-mono text-[10px] uppercase tracking-widest">
                      {item.category ? (typeof item.category === 'string' ? item.category : item.category.name) : (item.type || 'UNKNOWN')}
                    </span>
                  </div>

                  {/* Properties */}
                  <div className="flex flex-col gap-1 font-mono text-[10px] text-gray-500 uppercase">
                    <span className="truncate">C: {item.color || '--'}</span>
                    <span className="truncate">M: {item.material || '--'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="size-8 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-black hover:text-white hover:bg-black transition-all"
                      title="Edit Record"
                    >
                      <Edit className="size-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeletingId(item.id)}
                      className="size-8 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Purge Record"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
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

      {/* Delete Confirmation Modal (Brutalist) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-red-500 w-full max-w-md p-8 shadow-[8px_8px_0_0_rgba(239,68,68,0.3)] animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-heading font-bold text-red-500 uppercase tracking-tighter mb-2">Warning: Purge Data</h2>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest leading-relaxed mb-8">
              This action will permanently erase the selected record from the system catalog. This operation cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 font-mono text-xs uppercase tracking-widest hover:border-black hover:text-black transition-colors"
              >
                Abort
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isDeleting ? "Purging..." : "Confirm Purge"}
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
