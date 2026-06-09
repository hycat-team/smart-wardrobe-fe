export interface WalletDTO {
  userID: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface WalletStatementDTO {
  id: string;
  userID: string;
  amount: number;
  transactionType: number;
  previousBalance: number;
  newBalance: number;
  description: string;
  createdAt: string;
}

export interface WalletTopUpReq {
  amount: number;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentLinkDTO {
  paymentUrl: string;
  orderCode: number;
}
