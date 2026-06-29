'use client';

import React, { useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useB2BDemoStore, CartItem } from '@/lib/mock-data/b2b/store';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function GlobalCartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, toggleItemSelection, toggleBrandSelection, toggleAllSelection } = useB2BDemoStore();

  const selectedItems = cart.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const groupedCart = useMemo(() => {
    const groups: Record<string, { brandName: string; items: CartItem[] }> = {};
    cart.forEach(item => {
      if (!groups[item.brandId]) {
        groups[item.brandId] = { brandName: item.brandName, items: [] };
      }
      groups[item.brandId].items.push(item);
    });
    return Object.entries(groups);
  }, [cart]);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen} modal={false}>
      <SheetContent hideOverlay className="w-full sm:max-w-md p-0 flex flex-col bg-background border border-border sm:rounded-3xl shadow-2xl z-[100]">
        <SheetHeader className="p-6 border-b border-border text-left bg-background sm:rounded-t-3xl">
          <SheetTitle className="font-semibold text-3xl tracking-tight flex items-center gap-3 text-foreground">
            <ShoppingBag className="w-6 h-6" />
            Giỏ Hàng
          </SheetTitle>
          <SheetDescription className="font-semibold uppercase tracking-widest text-[10px] text-muted-foreground flex items-center justify-between mt-2">
            <span>{cart.length} sản phẩm trong giỏ</span>
            {cart.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors text-foreground">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleAllSelection(e.target.checked)}
                  className="w-3.5 h-3.5 accent-foreground cursor-pointer"
                />
                Chọn tất cả
              </label>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="font-semibold text-xs uppercase tracking-widest">Giỏ hàng trống</p>
            </div>
          ) : (
            groupedCart.map(([brandId, group]) => {
              const isBrandSelected = group.items.length > 0 && group.items.every(i => i.selected);
              return (
                <div key={brandId} className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <input
                      type="checkbox"
                      checked={isBrandSelected}
                      onChange={(e) => toggleBrandSelection(brandId, e.target.checked)}
                      className="w-4 h-4 accent-foreground cursor-pointer"
                    />
                    <h3 className="font-bold text-xs uppercase tracking-widest text-foreground">
                      {group.brandName}
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {group.items.map((item, idx) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 group/item">
                        <div className="pt-8">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItemSelection(item.productId, item.size, item.color)}
                            className="w-4 h-4 accent-foreground cursor-pointer"
                          />
                        </div>
                        <div className="w-20 h-24 bg-muted relative overflow-hidden flex-shrink-0 rounded-xl">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div className="flex flex-col flex-1 justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-lg font-medium leading-tight text-foreground line-clamp-2">
                                {item.name}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                              {item.size} / {item.color}
                            </p>
                          </div>
                          <div className="flex items-end justify-between mt-2">
                            <div className="flex items-center border border-border rounded-full h-8 overflow-hidden">
                              <button
                                className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-semibold text-xs text-foreground">{item.quantity}</span>
                              <button
                                className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {(item.price * item.quantity).toLocaleString()}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-background sm:rounded-b-3xl space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between font-medium text-xs text-muted-foreground uppercase tracking-widest">
                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between font-medium text-xs text-muted-foreground uppercase tracking-widest">
                <span>Phí vận chuyển</span>
                <span>Tính lúc thanh toán</span>
              </div>
              <div className="h-px bg-border w-full my-2" />
              <div className="flex justify-between text-2xl font-medium text-foreground">
                <span>Tổng cộng</span>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
            </div>

            <Link href="/checkout" onClick={(e) => {
              if (selectedItems.length === 0) e.preventDefault();
              else setCartOpen(false);
            }} className="block">
              <Button
                disabled={selectedItems.length === 0}
                className="w-full h-14 rounded-full font-bold text-xs uppercase tracking-widest transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                Thanh toán ngay {selectedItems.length > 0 && `(${selectedItems.length})`}
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
