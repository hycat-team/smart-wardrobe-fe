"use client";
import { useState, useEffect } from "react";
import { Search, Package, RefreshCcw, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockOrders = [
  { id: "ORD-001", orderNumber: "#10045", customer: "Nguyễn Văn A", items: "Áo thun đen (M) x2", totalAmount: 500000, date: "2026-06-25", status: "Hoàn thành", type: "sold" },
  { id: "ORD-002", orderNumber: "#10046", customer: "Trần Thị B", items: "Quần jean ống rộng (L) x1", totalAmount: 750000, date: "2026-06-26", status: "Đang giao", type: "sold" },
  { id: "ORD-003", orderNumber: "#10042", customer: "Lê Văn C", items: "Áo khoác bomber (XL) x1", totalAmount: 1200000, date: "2026-06-22", status: "Yêu cầu đổi trả", type: "returned" },
  { id: "ORD-004", orderNumber: "#10039", customer: "Phạm Thị D", items: "Váy hoa nhí (S) x1", totalAmount: 450000, date: "2026-06-20", status: "Đã hoàn tiền", type: "returned" },
  { id: "ORD-005", orderNumber: "#10047", customer: "Hoàng Văn E", items: "Áo len cổ lọ (M) x1", totalAmount: 600000, date: "2026-06-27", status: "Đã xác nhận", type: "sold" },
];

export function BrandOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sold");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("brand_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders(mockOrders);
        localStorage.setItem("brand_orders", JSON.stringify(mockOrders));
      }
    } catch (e) {
      setOrders(mockOrders);
    }
  }, []);

  const updateOrderStatus = (id: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("brand_orders", JSON.stringify(updatedOrders));
    toast.success(`Đã cập nhật trạng thái đơn hàng thành: ${newStatus}`);
  };

  const filteredOrders = orders.filter(order =>
    order.type === activeTab &&
    (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hoàn thành": return <Badge className="bg-green-500 hover:bg-green-600">Hoàn thành</Badge>;
      case "Đang giao": return <Badge className="bg-blue-500 hover:bg-blue-600">Đang giao</Badge>;
      case "Đã xác nhận": return <Badge className="bg-primary hover:bg-primary/90">Đã xác nhận</Badge>;
      case "Yêu cầu đổi trả": return <Badge variant="destructive">Yêu cầu đổi trả</Badge>;
      case "Đã hoàn tiền": return <Badge variant="outline" className="border-green-500 text-green-600">Đã hoàn tiền</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto">
      {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Đơn hàng</h1>
          <p className="text-muted-foreground mt-1">Quản lý các đơn hàng đã bán và yêu cầu đổi trả.</p>
        </div>
      </div> */}

      <Tabs defaultValue="sold" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 border border-border h-12 p-1 rounded-xl">
            <TabsTrigger value="sold" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-6 h-full font-medium transition-all">
              <Package className="w-4 h-4 mr-2" />
              Đơn hàng đã bán
            </TabsTrigger>
            <TabsTrigger value="returned" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-6 h-full font-medium transition-all">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Yêu cầu đổi/trả
            </TabsTrigger>
          </TabsList>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm mã đơn, tên KH..."
              className="pl-9 bg-card border-border rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="sold" className="mt-0 outline-none">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                    <TableHead className="font-semibold">Khách hàng</TableHead>
                    <TableHead className="font-semibold">Sản phẩm</TableHead>
                    <TableHead className="font-semibold">Ngày đặt</TableHead>
                    <TableHead className="font-semibold text-right">Tổng tiền</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Không tìm thấy đơn hàng nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="group">
                        <TableCell className="font-semibold text-foreground">{order.orderNumber}</TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">{order.items}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full group-hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Đang giao')}>
                                Cập nhật: Đang giao
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Hoàn thành')}>
                                Cập nhật: Hoàn thành
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="returned" className="mt-0 outline-none">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                    <TableHead className="font-semibold">Khách hàng</TableHead>
                    <TableHead className="font-semibold">Sản phẩm đổi/trả</TableHead>
                    <TableHead className="font-semibold">Ngày yêu cầu</TableHead>
                    <TableHead className="font-semibold text-right">Số tiền</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Không có yêu cầu đổi trả nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="group">
                        <TableCell className="font-semibold text-foreground">{order.orderNumber}</TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">{order.items}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full group-hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Đã hoàn tiền')}>
                                Xác nhận hoàn tiền
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Hoàn thành đổi')}>
                                Đã hoàn thành đổi
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
