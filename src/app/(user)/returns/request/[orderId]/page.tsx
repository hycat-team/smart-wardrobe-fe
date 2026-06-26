import { Metadata } from "next";
import ReturnRequestClient from "./components/ReturnRequestClient";
export const metadata: Metadata = {
  title: "Yêu cầu đổi trả | Smart Wardrobe",
  description: "Tạo yêu cầu đổi trả cho đơn hàng",
};
export default async function ReturnRequestPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <ReturnRequestClient orderId={orderId} />;
}
