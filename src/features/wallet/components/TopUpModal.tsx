"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { useTopUpWallet } from "../queries/wallet.queries";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function TopUpModal({ open, onOpenChange }: Props) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const topUpMutation = useTopUpWallet();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 10000) {
      setError("Số tiền nạp tối thiểu là 10,000đ");
      return;
    }
    setError("");
    topUpMutation.mutate(
      { amount: numAmount, returnUrl: window.location.href, cancelUrl: window.location.href },
      {
        onSuccess: (data) => {
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
          }
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogContent className="sm:max-w-[425px]">
        {" "}
        <DialogHeader>
          {" "}
          <DialogTitle>Nạp tiền vào ví</DialogTitle>{" "}
          <DialogDescription>
            {" "}
            Nhập số tiền bạn muốn nạp. Tối thiểu 10,000 VND.{" "}
          </DialogDescription>{" "}
        </DialogHeader>{" "}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {" "}
          <FieldGroup>
            {" "}
            <Field data-invalid={!!error}>
              {" "}
              <FieldLabel htmlFor="amount">Số tiền (VND)</FieldLabel>{" "}
              <Input
                id="amount"
                type="number"
                placeholder="100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                aria-invalid={!!error}
              />{" "}
              {error && <FieldError>{error}</FieldError>}{" "}
            </Field>{" "}
          </FieldGroup>{" "}
          <div className="flex justify-end gap-3 mt-4">
            {" "}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {" "}
              Hủy{" "}
            </Button>{" "}
            <Button type="submit" disabled={topUpMutation.isPending}>
              {" "}
              {topUpMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" data-icon="inline-start" />
              )}{" "}
              Tiếp tục{" "}
            </Button>{" "}
          </div>{" "}
        </form>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
