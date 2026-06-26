"use client";
import React from "react";
import { SubscriptionPlan } from "../types";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import {
  usePurchaseDirectMutation,
  usePurchaseWithWalletMutation,
} from "@/features/billing/queries/billing.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface PricingCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  currentPlanSlug?: string;
}
export const PricingCard = ({ plan, isPopular, currentPlanSlug }: PricingCardProps) => {
  const purchaseDirect = usePurchaseDirectMutation();
  const purchaseWallet = usePurchaseWithWalletMutation();
  const handlePurchaseDirect = () => {
    purchaseDirect.mutate({ planSlug: plan.slug || (plan as any).planSlug });
  };
  const handlePurchaseWallet = () => {
    purchaseWallet.mutate({ planSlug: plan.slug || (plan as any).planSlug });
  };
  const priceValue = plan.price || plan.Price || 0;
  const isFree = priceValue === 0;
  const planSlug = plan.slug || plan.planSlug || plan.PlanSlug || (plan as any).slug;
  const isCurrentPlan = currentPlanSlug && planSlug === currentPlanSlug;
  const shouldHideButton = isFree || isCurrentPlan;
  return (
    <div
      className={`group relative flex flex-col h-full min-h-[500px] w-full transition-colors duration-700 ${isPopular ? "bg-[#1A1A1A] text-[#F4F1EE] shadow-2xl" : "bg-[#F4F1EE] text-[#1A1A1A] hover:bg-[#EAE5DF]"}`}
    >
      {" "}
      {/* Background Noise Texture */}{" "}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-difference"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>{" "}
      {isPopular && (
        <div className="absolute -right-6 -top-6 w-28 h-28 flex items-center justify-center z-30 pointer-events-none drop-shadow-xl">
          {" "}
          <div
            className="absolute inset-0 bg-[#D9C5B2] animate-[spin_12s_linear_infinite]"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          ></div>{" "}
          <span className="font-sans text-[9px] font-bold text-[#1A1A1A] relative z-10 text-center leading-[1.2]">
            {" "}
            PRO
            <br />
            CHOICE{" "}
          </span>{" "}
        </div>
      )}{" "}
      {/* Decorative vertical text */}{" "}
      <div className="absolute left-4 top-12 bottom-12 w-4 border-l border-current/10 hidden md:flex items-center justify-center opacity-30">
        {" "}
        <span
          className="font-sans text-[10px] rotate-180 whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          {" "}
          {isPopular ? "PREMIUM ACCESS TIER" : "STANDARD MEMBERSHIP"}{" "}
        </span>{" "}
      </div>{" "}
      <div className="flex-1 p-8 md:pl-16 md:pr-10 pt-14 flex flex-col relative z-10">
        {" "}
        <div className="mb-12">
          {" "}
          <h3 className="font-sans text-4xl md:text-5xl italic font-medium mb-5 tracking-tighter">
            {" "}
            {plan.name || plan.Name}{" "}
          </h3>{" "}
          <div className="w-12 h-[1px] bg-current/30 mb-6 transition-all duration-700 ease-out group-hover:w-full"></div>{" "}
          <p className="font-sans text-[11px] leading-loose opacity-60 min-h-[48px]">
            {" "}
            {plan.description || plan.Description || "Quản lý tủ đồ thông minh mỗi ngày."}{" "}
          </p>{" "}
        </div>{" "}
        <div className="mb-14 relative flex items-start gap-3">
          {" "}
          <span className="font-sans text-6xl md:text-7xl font-bold tracking-tighter leading-none group-hover:scale-105 origin-left transition-transform duration-500 ease-out">
            {" "}
            {isFree ? "Free" : priceValue.toLocaleString("vi-VN")}{" "}
          </span>{" "}
          {!isFree && (
            <div className="flex flex-col mt-2">
              {" "}
              <span className="font-sans text-[13px] font-bold text-[#D9C5B2]"> VNĐ </span>{" "}
              <span className="font-sans text-[9px] opacity-40 mt-1">
                {" "}
                / {plan.durationDays || plan.DurationDays || 30} NGÀY{" "}
              </span>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <ul className="space-y-5 mb-14 flex-1 font-sans text-[11px] ">
          {" "}
          <li className="flex items-center gap-4 group/item">
            {" "}
            <span className="w-[5px] h-[5px] bg-[#D9C5B2] transition-transform duration-300 group-hover/item:scale-[2]"></span>{" "}
            <span className="opacity-70">
              TỐI ĐA{" "}
              <strong className="font-bold opacity-100 text-[12px]">
                {plan.maxOutfits || plan.MaxOutfits}
              </strong>{" "}
              BỘ PHỐI ĐỒ
            </span>{" "}
          </li>{" "}
          <li className="flex items-center gap-4 group/item">
            {" "}
            <span className="w-[5px] h-[5px] bg-[#D9C5B2] transition-transform duration-300 group-hover/item:scale-[2]"></span>{" "}
            <span className="opacity-70">
              TẠO PHỐI ĐỒ AI:{" "}
              <strong className="font-bold opacity-100 text-[12px]">
                {plan.aiOutfitDailyQuota || plan.AiOutfitDailyQuota || "∞"}
              </strong>{" "}
              LẦN/NGÀY
            </span>{" "}
          </li>{" "}
          <li className="flex items-center gap-4 group/item">
            {" "}
            <span className="w-[5px] h-[5px] bg-[#D9C5B2] transition-transform duration-300 group-hover/item:scale-[2]"></span>{" "}
            <span className="opacity-70">
              CHAT VỚI AI:{" "}
              <strong className="font-bold opacity-100 text-[12px]">
                {plan.aiChatDailyQuota || plan.AiChatDailyQuota || "∞"}
              </strong>{" "}
              LẦN/NGÀY
            </span>{" "}
          </li>{" "}
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-4 group/item">
              {" "}
              <span className="w-[5px] h-[5px] bg-[#D9C5B2] transition-transform duration-300 group-hover/item:scale-[2]"></span>{" "}
              <span className="opacity-70">{feature}</span>{" "}
            </li>
          ))}{" "}
        </ul>{" "}
        {!shouldHideButton && (
          <div className="mt-auto relative z-20">
            {" "}
            <Dialog>
              {" "}
              <DialogTrigger asChild>
                {" "}
                <Button
                  className={`w-full h-16 rounded-xl font-sans text-[11px] relative overflow-hidden group/btn ${isPopular ? "bg-[#D9C5B2] text-[#1A1A1A] hover:bg-[#F4F1EE]" : "bg-transparent text-current border border-current hover:bg-[#1A1A1A] hover:text-[#F4F1EE]"}`}
                >
                  {" "}
                  <span className="relative z-10 flex items-center justify-between w-full px-6">
                    {" "}
                    <span>ĐĂNG KÝ NGAY</span>{" "}
                    <span className="transform translate-x-4 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
                      →
                    </span>{" "}
                  </span>{" "}
                </Button>{" "}
              </DialogTrigger>{" "}
              <DialogContent className="sm:max-w-md bg-[#F4F1EE] border-[#1A1A1A]/10 rounded-xl p-8">
                {" "}
                <DialogHeader>
                  {" "}
                  <DialogTitle className="font-sans text-4xl italic tracking-tight font-medium text-[#1A1A1A] mb-2">
                    Thanh toán
                  </DialogTitle>{" "}
                </DialogHeader>{" "}
                <div className="flex flex-col gap-6 py-4">
                  {" "}
                  <div className="font-sans text-[12px] text-[#1A1A1A]/70 leading-relaxed border-l-[3px] border-[#D9C5B2] pl-4">
                    {" "}
                    <span className="block mb-1 opacity-60 text-[10px]">GÓI THÀNH VIÊN</span>{" "}
                    <span className="font-bold text-[#1A1A1A] text-[14px] block mb-3">
                      {plan.name || plan.Name}
                    </span>{" "}
                    <span className="block opacity-60 text-[10px]">TỔNG THANH TOÁN</span>{" "}
                    <span className="font-bold text-[#1A1A1A] text-[14px]">
                      {priceValue.toLocaleString("vi-VN")} VNĐ
                    </span>{" "}
                  </div>{" "}
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {" "}
                    <Button
                      onClick={handlePurchaseDirect}
                      disabled={purchaseDirect.isPending}
                      className="h-14 rounded-xl bg-[#1A1A1A] text-white hover:bg-[#D9C5B2] hover:text-[#1A1A1A] font-sans text-[11px] flex items-center justify-between px-6 transition-colors group/pay"
                    >
                      {" "}
                      <span>Chuyển khoản (VietQR)</span>{" "}
                      <span className="opacity-50 group-hover/pay:opacity-100 group-hover/pay:translate-x-1 transition-all">
                        →
                      </span>{" "}
                    </Button>{" "}
                    <Button
                      onClick={handlePurchaseWallet}
                      disabled={purchaseWallet.isPending}
                      variant="outline"
                      className="h-14 rounded-xl border border-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-[#F4F1EE] text-[#1A1A1A] font-sans text-[11px] flex items-center justify-between px-6 transition-colors group/wallet"
                    >
                      {" "}
                      <span>Số dư ví CLOSY</span>{" "}
                      <span className="opacity-50 group-hover/wallet:opacity-100 group-hover/wallet:translate-x-1 transition-all">
                        →
                      </span>{" "}
                    </Button>{" "}
                  </div>{" "}
                </div>{" "}
              </DialogContent>{" "}
            </Dialog>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
