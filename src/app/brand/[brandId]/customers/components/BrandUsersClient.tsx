"use client";
import { useState, useEffect } from "react";
import { Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockUsers = [
  { id: "USR-001", name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0901234567", totalOrders: 5, totalSpent: 12500000, lastPurchase: "2026-06-25", status: "Thân thiết" },
  { id: "USR-002", name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0912345678", totalOrders: 1, totalSpent: 1500000, lastPurchase: "2026-06-20", status: "Mới" },
  { id: "USR-003", name: "Lê Văn C", email: "levanc@gmail.com", phone: "0923456789", totalOrders: 12, totalSpent: 45000000, lastPurchase: "2026-06-28", status: "VIP" },
];

export function BrandUsersClient() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load from localStorage or use mock
    try {
      const stored = localStorage.getItem("brand_customers");
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        setUsers(mockUsers);
        localStorage.setItem("brand_customers", JSON.stringify(mockUsers));
      }
    } catch (e) {
      setUsers(mockUsers);
    }
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VIP": return <Badge className="bg-amber-500 hover:bg-amber-600">VIP</Badge>;
      case "Thân thiết": return <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">Thân thiết</Badge>;
      case "Mới": return <Badge variant="secondary">Mới</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto">
      {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Khách hàng</h1>
          <p className="text-muted-foreground mt-1">Quản lý danh sách khách hàng đã mua sản phẩm của bạn.</p>
        </div>
      </div> */}

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên, email, sđt..."
            className="pl-9 bg-background border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Khách hàng</TableHead>
                <TableHead className="font-semibold">Liên hệ</TableHead>
                <TableHead className="font-semibold text-right">Tổng chi tiêu</TableHead>
                <TableHead className="font-semibold text-center">Đơn hàng</TableHead>
                <TableHead className="font-semibold">Lần cuối mua</TableHead>
                <TableHead className="font-semibold">Phân hạng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Không tìm thấy khách hàng nào.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCurrency(user.totalSpent)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-semibold">{user.totalOrders}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.lastPurchase).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
