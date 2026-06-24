import { Metadata } from 'next';
import { mockProducts } from '@/lib/mock-data/b2b';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quản lý Sản phẩm | Brand Workspace',
};

export default function BrandProductsPage() {
  const products = mockProducts.filter(p => p.brandId === 'brand_001');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
        <Button className="rounded-none bg-black hover:bg-black/90 font-bold uppercase tracking-widest flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-white border border-black/10">
        <Table>
          <TableHeader>
            <TableRow className="border-black/10 hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Sản phẩm</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">SKU</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Giá bán</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Trạng thái</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} className="border-black/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F2EE] overflow-hidden">
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-sm">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{product.sku}</TableCell>
                <TableCell className="text-sm font-bold">{product.price.toLocaleString()}đ</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                    In Stock
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-sm font-bold underline decoration-1 underline-offset-2 text-black/50 hover:text-black">
                    Sửa
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
