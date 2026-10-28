import { Metadata } from "next";
import { DigitalSampleLabClient } from "./components/DigitalSampleLabClient";

export const metadata: Metadata = {
  title: "Digital Sample Lab | Closy for Brands",
  description: "Phòng thử mẫu số trên tủ đồ thật",
};

export default function DigitalSampleLabPage() {
  return <DigitalSampleLabClient />;
}
