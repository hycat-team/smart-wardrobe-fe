import { Metadata } from "next";
import CustomerCareClient from "./components/CustomerCareClient";
export const metadata: Metadata = { title: "Chăm sóc khách hàng | Không gian thương hiệu" };
export default function CustomerCarePage() {
  return <CustomerCareClient />;
}
