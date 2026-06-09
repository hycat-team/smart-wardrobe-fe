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
import { useAdminCatalog, useDeleteSystemWardrobeItem, useUpdateSystemWardrobeItem } from "@/features/admin/queries/admin.queries";

export function CatalogClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useAdminCatalog({ q: searchTerm });
  
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteSystemWardrobeItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateSystemWardrobeItem();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const items = data || [];

  const handleDelete = () => {
    if (deletingId) {
      deleteItem(deletingId, {
        onSuccess: () => setDeletingId(null)
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const payload = {
        categoryId: editingItem.category?.id || editingItem.categoryId,
        color: editingItem.color,
        fit: editingItem.fit,
        material: editingItem.material,
        pattern: editingItem.pattern,
        price: Number(editingItem.price),
        seasonality: editingItem.seasonality,
        style: editingItem.style,
      };
      updateItem({ id: editingItem.id, data: payload }, {
        onSuccess: () => setEditingItem(null)
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Catalog Hệ Thống</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh mục các trang phục mẫu (Base Wardrobe Items).</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm danh mục..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full pl-9 pr-4 rounded-xl bg-secondary border-transparent focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none"
            />
          </div>
          <Button className="shrink-0 gap-2">
            <Plus className="size-4" /> Thêm mới
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[100px]">Hình ảnh</TableHead>
              <TableHead>Tên trang phục</TableHead>
              <TableHead>Phân loại (Category)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="animate-spin text-muted-foreground mx-auto" /></TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-red-500">Lỗi tải dữ liệu.</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Không có dữ liệu.</TableCell></TableRow>
            ) : items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="size-12 rounded-md bg-muted overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">N/A</span>}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.name || item.title || 'Không tên'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.category ? (typeof item.category === 'string' ? item.category : item.category.name) : (item.type || 'N/A')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                      <Edit className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa trang phục mẫu này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trang phục</DialogTitle>
            <DialogDescription>Thay đổi thông tin phân loại cho trang phục mẫu.</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Màu sắc</Label>
                  <Input value={editingItem.color || ''} onChange={(e) => setEditingItem({...editingItem, color: e.target.value})} placeholder="Đen, Trắng..." />
                </div>
                <div className="space-y-2">
                  <Label>Chất liệu</Label>
                  <Input value={editingItem.material || ''} onChange={(e) => setEditingItem({...editingItem, material: e.target.value})} placeholder="Cotton, Denim..." />
                </div>
                <div className="space-y-2">
                  <Label>Kiểu dáng (Fit)</Label>
                  <Input value={editingItem.fit || ''} onChange={(e) => setEditingItem({...editingItem, fit: e.target.value})} placeholder="Regular, Slim..." />
                </div>
                <div className="space-y-2">
                  <Label>Phong cách</Label>
                  <Input value={editingItem.style || ''} onChange={(e) => setEditingItem({...editingItem, style: e.target.value})} placeholder="Casual, Formal..." />
                </div>
                <div className="space-y-2">
                  <Label>Mùa</Label>
                  <Input value={editingItem.seasonality || ''} onChange={(e) => setEditingItem({...editingItem, seasonality: e.target.value})} placeholder="Hè, Đông..." />
                </div>
                <div className="space-y-2">
                  <Label>Họa tiết</Label>
                  <Input value={editingItem.pattern || ''} onChange={(e) => setEditingItem({...editingItem, pattern: e.target.value})} placeholder="Trơn, Kẻ sọc..." />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Giá dự kiến (VNĐ)</Label>
                  <Input type="number" value={editingItem.price || 0} onChange={(e) => setEditingItem({...editingItem, price: e.target.value})} />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Hủy</Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
