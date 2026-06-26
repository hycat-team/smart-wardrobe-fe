"use client";
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTopupMutation } from "../queries/billing.queries";
import { Zap } from "lucide-react";
const SUGGESTED_AMOUNTS = [50000, 100000, 200000, 500000];
export const TopupModal = () => {
  const [amount, setAmount] = useState<number | "">("");
  const topupMutation = useTopupMutation();
  const handleTopup = () => {
    if (!amount || amount < 10000) return;
    topupMutation.mutate({ amount: Number(amount) });
  };
  return (
    <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white rounded-3xl">
      {" "}
      <DialogHeader>
        {" "}
        <DialogTitle className="text-2xl font-bold">Nạp tiền vào ví</DialogTitle>{" "}
        <DialogDescription className="text-zinc-400">
          {" "}
          Chọn hoặc nhập số tiền bạn muốn nạp (Tối thiểu 10.000đ).{" "}
        </DialogDescription>{" "}
      </DialogHeader>{" "}
      <div className="py-6 space-y-6">
        {" "}
        <div className="grid grid-cols-2 gap-3">
          {" "}
          {SUGGESTED_AMOUNTS.map((val) => (
            <Button
              key={val}
              type="button"
              variant="outline"
              onClick={() => setAmount(val)}
              className={`h-12 rounded-xl transition-all ${amount === val ? "border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"}`}
            >
              {" "}
              {val.toLocaleString("vi-VN")}đ{" "}
            </Button>
          ))}{" "}
        </div>{" "}
        <div className="relative">
          {" "}
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || "")}
            placeholder="Nhập số tiền khác..."
            className="h-14 pl-4 pr-12 text-lg bg-zinc-900 border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl placeholder:text-zinc-600"
          />{" "}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">
            VNĐ
          </span>{" "}
        </div>{" "}
        <Button
          onClick={handleTopup}
          disabled={!amount || amount < 10000 || topupMutation.isPending}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {" "}
          {topupMutation.isPending ? (
            "Đang tạo thanh toán..."
          ) : (
            <>
              {" "}
              <Zap size={20} className="fill-white" /> Nạp{" "}
              {amount ? amount.toLocaleString("vi-VN") + "đ" : "Tiền"}{" "}
            </>
          )}{" "}
        </Button>{" "}
      </div>{" "}
    </DialogContent>
  );
};
