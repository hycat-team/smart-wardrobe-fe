export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
}

export interface Statement {
  id: string;
  userId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: "TOPUP" | "PAYMENT" | "REFUND";
  description: string;
  createdAt: string;
}

export interface DirectPurchaseReq {
  planSlug: string;
}

export interface TopUpReq {
  amount: number;
}

export interface PaymentLinkRes {
  checkoutUrl?: string;
  paymentUrl?: string;
  paymentLinkId?: string;
}
