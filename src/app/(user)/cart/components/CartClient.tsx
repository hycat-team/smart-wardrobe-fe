"use client";
import React from "react";
import { useB2BDemoStore } from "@/lib/mock-data/b2b/store";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { mockBrands } from "@/lib/mock-data/b2b";
export default function CartClient() {
  const { cart, removeFromCart, updateQuantity } = useB2BDemoStore();
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cart.length === 0) {
    return (
      <div className="flex-1 bg-white text-black min-h-[70vh] flex flex-col items-center justify-center">
        {" "}
        <h1 className="text-3xl font-bold tracking-tight mb-4">Giỏ hàng trống</h1>{" "}
        <p className="text-black/60 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>{" "}
        <Link href="/community">
          {" "}
          <Button className="rounded-xl bg-black text-white font-bold px-8 h-12">
            {" "}
            Khám phá Brands{" "}
          </Button>{" "}
        </Link>{" "}
      </div>
    );
  }
  return (
    <div className="flex-1 bg-white text-black min-h-screen pb-24">
      {" "}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {" "}
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-10">Giỏ hàng</h1>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {" "}
          {/* Cart Items */}{" "}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {" "}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-black/10 text-xs font-bold text-black/50">
              {" "}
              <div className="col-span-6">Sản phẩm</div>{" "}
              <div className="col-span-2 text-center">Số lượng</div>{" "}
              <div className="col-span-3 text-right">Tổng</div>{" "}
              <div className="col-span-1"></div>{" "}
            </div>{" "}
            <div className="flex flex-col gap-6">
              {" "}
              {cart.map((item, idx) => {
                const brand = mockBrands.find((b) => b.id === item.brandId);
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 sm:py-0 border-b border-black/10 sm:border-0"
                  >
                    {" "}
                    <div className="col-span-1 sm:col-span-6 flex gap-4">
                      {" "}
                      <div className="w-20 sm:w-24 aspect-[3/4] bg-[#F5F2EE] overflow-hidden flex-shrink-0">
                        {" "}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />{" "}
                      </div>{" "}
                      <div className="flex flex-col justify-center gap-1">
                        {" "}
                        <Link
                          href={`/brands/${item.brandId}`}
                          className="text-xs font-bold text-black/50 hover:text-black "
                        >
                          {" "}
                          {brand?.name}{" "}
                        </Link>{" "}
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-bold text-sm hover:underline"
                        >
                          {" "}
                          {item.name}{" "}
                        </Link>{" "}
                        <div className="text-xs text-black/60 mt-1">
                          {" "}
                          Size: <span className="font-bold text-black">{item.size}</span> | Màu:{" "}
                          <span className="font-bold text-black">{item.color}</span>{" "}
                        </div>{" "}
                        <div className="text-sm font-bold mt-2 sm:hidden">
                          {item.price.toLocaleString()}đ
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="col-span-1 sm:col-span-2 flex items-center sm:justify-center">
                      {" "}
                      <div className="flex items-center border border-black/20 h-10">
                        {" "}
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-3 text-black/50 hover:text-black transition-colors"
                        >
                          {" "}
                          -{" "}
                        </button>{" "}
                        <span className="font-bold text-sm w-6 text-center">
                          {item.quantity}
                        </span>{" "}
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                          }
                          className="px-3 text-black/50 hover:text-black transition-colors"
                        >
                          {" "}
                          +{" "}
                        </button>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="hidden sm:block col-span-3 text-right font-bold">
                      {" "}
                      {(item.price * item.quantity).toLocaleString()}đ{" "}
                    </div>{" "}
                    <div className="hidden sm:flex col-span-1 justify-end">
                      {" "}
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-black/40 hover:text-red-600 transition-colors"
                      >
                        {" "}
                        <Trash2 className="w-5 h-5" />{" "}
                      </button>{" "}
                    </div>{" "}
                    {/* Mobile delete button */}{" "}
                    <div className="col-span-1 sm:hidden flex justify-end -mt-8">
                      {" "}
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-black/40 hover:text-red-600 transition-colors text-xs font-bold flex items-center gap-1"
                      >
                        {" "}
                        <Trash2 className="w-4 h-4" /> Xoá{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>
                );
              })}{" "}
            </div>{" "}
          </div>{" "}
          {/* Order Summary */}{" "}
          <div className="lg:col-span-4">
            {" "}
            <div className="bg-[#FAFAFA] p-6 lg:p-8 flex flex-col gap-6 sticky top-10">
              {" "}
              <h2 className="font-bold text-lg border-b border-black/10 pb-4">
                Tóm tắt đơn hàng
              </h2>{" "}
              <div className="flex flex-col gap-4">
                {" "}
                <div className="flex items-center justify-between text-sm">
                  {" "}
                  <span className="text-black/60">Tạm tính</span>{" "}
                  <span className="font-bold">{totalAmount.toLocaleString()}đ</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between text-sm">
                  {" "}
                  <span className="text-black/60">Phí giao hàng</span>{" "}
                  <span className="font-bold">Miễn phí</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="h-px w-full bg-black/10"></div>{" "}
              <div className="flex items-center justify-between text-lg">
                {" "}
                <span className="font-bold">Tổng cộng</span>{" "}
                <span className="font-bold text-xl">{totalAmount.toLocaleString()}đ</span>{" "}
              </div>{" "}
              <Link href="/checkout" className="w-full mt-4">
                {" "}
                <Button className="w-full rounded-xl bg-black hover:bg-black/90 text-white h-14 font-bold flex items-center justify-center gap-2 group">
                  {" "}
                  Tiến hành thanh toán{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />{" "}
                </Button>{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
