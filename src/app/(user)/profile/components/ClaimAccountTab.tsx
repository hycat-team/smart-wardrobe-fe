"use client";
import React, { useState } from "react";
import { useClaimOfflineAccount } from "@/features/brands/queries/user-brands.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Link as LinkIcon, Store } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ClaimAccountTab() {
  const [claimToken, setClaimToken] = useState("");
  const { mutateAsync: claimAccount, isPending } = useClaimOfflineAccount();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimToken.trim()) return;

    try {
      await claimAccount(claimToken);
      setClaimToken("");
    } catch (error) {
      // Error is handled by mutation
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm rounded-3xl mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <LinkIcon className="w-5 h-5 text-primary" />
          Liên kết tài khoản nhãn hàng
        </CardTitle>
        <CardDescription>
          Nhập mã liên kết (Claim Token) do nhân viên cửa hàng cung cấp để đồng bộ lịch sử mua hàng và điểm thưởng offline của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleClaim} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="token" className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Mã liên kết</Label>
            <div className="flex gap-2">
              <Input
                id="token"
                value={claimToken}
                onChange={(e) => setClaimToken(e.target.value)}
                placeholder="VD: 12345678"
                className="flex-1 rounded-xl bg-muted/50"
              />
              <Button type="submit" disabled={isPending || !claimToken.trim()} className="rounded-xl px-6">
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Store className="w-4 h-4 mr-2" />}
                Liên kết
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
