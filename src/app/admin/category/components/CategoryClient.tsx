"use client";
import { useState } from "react";
import { Search, Loader2, Plus, Edit, Trash2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/admin/queries/admin.queries";

export function CategoryClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: categories, isLoading, isError } = useAdminCategories();

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({ name: "", slug: "" });

  const filteredItems = (categories || []).filter((cat: any) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (deletingId) {
      deleteCategory(deletingId, {
        onSuccess: () => setDeletingId(null)
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      createCategory(formData, {
        onSuccess: () => {
          setIsAdding(false);
          setFormData({ name: "", slug: "" });
        }
      });
    } else if (editingItem) {
      updateCategory({ id: editingItem.id, data: formData }, {
        onSuccess: () => {
          setEditingItem(null);
          setFormData({ name: "", slug: "" });
        }
      });
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ name: item.name, slug: item.slug });
  };

  const openAdd = () => {
    setIsAdding(true);
    setFormData({ name: "", slug: "" });
  };

  const handleCloseDialog = () => {
    setEditingItem(null);
    setIsAdding(false);
    setFormData({ name: "", slug: "" });
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-foreground">
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-8 pt-6 border-b border-border pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-[1.1] uppercase">
              DANH MỤC
            </h1> */}
            <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-[0.1em] max-w-md leading-relaxed border-l-2 border-border pl-4">
              Quản lý danh sách phân loại trang phục trong hệ thống.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="TÌM KIẾM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full pl-10 pr-4 bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-[11px] font-semibold uppercase tracking-widest transition-all outline-none rounded-2xl text-foreground placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>
            <Button onClick={openAdd} className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-[11px] uppercase tracking-widest gap-2 shadow-sm">
              <Plus className="size-4" /> Thêm Mới
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm p-6 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Tên danh mục</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] py-4 h-auto">Đường dẫn (Slug)</TableHead>
              <TableHead className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.15em] text-right py-4 h-auto">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="h-32 text-center border-b border-border"><Loader2 className="animate-spin text-muted-foreground mx-auto" /></TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={3} className="h-32 text-center text-foreground font-semibold uppercase text-[11px] border-b border-border">Lỗi tải dữ liệu.</TableCell></TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="h-32 text-center text-muted-foreground font-semibold uppercase text-[11px] tracking-widest border-b border-border">Không có dữ liệu.</TableCell></TableRow>
            ) : filteredItems.map((item: any) => (
              <TableRow key={item.id} className="border-b border-border hover:bg-muted transition-colors">
                <TableCell className="font-semibold text-lg py-5">{item.name}</TableCell>
                <TableCell className="font-semibold text-[12px] text-muted-foreground py-5">{item.slug}</TableCell>
                <TableCell className="text-right py-5">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground hover:bg-transparent rounded-full h-8 w-8">
                      <Edit className="size-4" strokeWidth={1.5} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(item.id)} className="text-muted-foreground hover:text-red-500 hover:bg-transparent rounded-full h-8 w-8">
                      <Trash2 className="size-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="rounded-3xl border-border bg-background shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl text-foreground">Xác nhận xóa</DialogTitle>
            <DialogDescription className="font-semibold text-[11px] uppercase tracking-[0.05em] text-muted-foreground">
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDeletingId(null)} className="rounded-full font-semibold text-[11px] uppercase tracking-widest border-border">Hủy</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="rounded-full font-semibold text-[11px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-sm">
              {isDeleting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              XÓA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isAdding || !!editingItem} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-border bg-background shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl text-foreground">
              {isAdding ? "Thêm Mới Danh Mục" : "Cập Nhật Danh Mục"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">Tên danh mục</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Áo thun..."
                  className="rounded-2xl border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary font-semibold text-[12px] text-foreground px-4 py-3 h-auto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">Đường dẫn (Slug)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ao-thun"
                  className="rounded-2xl border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary font-semibold text-[12px] text-foreground px-4 py-3 h-auto"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="rounded-full font-semibold text-[11px] uppercase tracking-widest border-border">Hủy</Button>
              <Button type="submit" disabled={isCreating || isUpdating} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-[11px] uppercase tracking-widest shadow-sm">
                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                LƯU THAY ĐỔI
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
