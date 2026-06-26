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
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-[#FAFAFA] border-l border-black/10">
        <SheetHeader className="p-6 border-b border-black/10 text-left bg-white">
          <SheetTitle className="font-['Playfair_Display'] text-3xl font-medium tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            Giỏ Hàng
          </SheetTitle>
          <SheetDescription className="font-['IBM_Plex_Mono'] uppercase tracking-widest text-[10px] text-[#A3A3A3] flex items-center justify-between mt-2">
            <span>{cart.length} sản phẩm trong giỏ</span>
            {cart.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#111] transition-colors">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={(e) => toggleAllSelection(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#111] cursor-pointer"
                />
                Chọn tất cả
              </label>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#A3A3A3] space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest">Giỏ hàng trống</p>
              {/* <Button 
                variant="outline" 
                onClick={() => setCartOpen(false)}
                className="mt-4 rounded-none border-black/20 text-[#111] hover:bg-black/5 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest"
              >
                Tiếp tục mua sắm
              </Button> */}
            </div>
          ) : (
            groupedCart.map(([brandId, group]) => {
              const isBrandSelected = group.items.length > 0 && group.items.every(i => i.selected);
              return (
                <div key={brandId} className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-black/5">
                    <input 
                      type="checkbox" 
                      checked={isBrandSelected}
                      onChange={(e) => toggleBrandSelection(brandId, e.target.checked)}
                      className="w-4 h-4 accent-[#111] cursor-pointer"
                    />
                    <h3 className="font-['IBM_Plex_Mono'] font-bold text-xs uppercase tracking-widest text-[#111]">
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
                            className="w-4 h-4 accent-[#111] cursor-pointer"
                          />
                        </div>
                        <div className="w-20 h-24 bg-[#F5F2EE] relative overflow-hidden flex-shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div className="flex flex-col flex-1 justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-['Playfair_Display'] text-lg font-medium leading-tight text-[#111] line-clamp-2">
                                {item.name}
                              </h3>
                              <button 
                                onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                className="text-[#A3A3A3] hover:text-red-500 transition-colors shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-['IBM_Plex_Mono'] text-[10px] text-[#666] uppercase tracking-widest mt-1">
                              {item.size} / {item.color}
                            </p>
                          </div>
                          <div className="flex items-end justify-between mt-2">
                            <div className="flex items-center border border-black/10">
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-[#111] hover:bg-black/5 disabled:opacity-50"
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-['IBM_Plex_Mono'] text-xs">{item.quantity}</span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-[#111] hover:bg-black/5"
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-['IBM_Plex_Mono'] text-sm font-medium text-[#111]">
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
          <div className="p-6 border-t border-black/10 bg-white space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between font-['IBM_Plex_Mono'] font-medium text-xs text-[#666] uppercase tracking-widest">
                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between font-['IBM_Plex_Mono'] font-medium text-xs text-[#666] uppercase tracking-widest">
                <span>Phí vận chuyển</span>
                <span>Tính lúc thanh toán</span>
              </div>
              <div className="h-px bg-black/10 w-full my-2" />
              <div className="flex justify-between font-['Playfair_Display'] text-2xl font-medium text-[#111]">
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
                className="w-full h-14 rounded-none bg-[#111] hover:bg-black text-white font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-widest transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
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
