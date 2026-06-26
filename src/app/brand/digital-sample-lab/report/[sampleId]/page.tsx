import { Metadata } from "next";
import { ReportClient } from "./components/ReportClient";
export const metadata: Metadata = {
  title: "Wardrobe Fit Report | Closy for Brands",
  description: "Báo cáo thử nghiệm mẫu số",
};
export default async function ReportPage({ params }: { params: Promise<{ sampleId: string }> }) {
  const resolvedParams = await params;
  return <ReportClient sampleId={resolvedParams.sampleId} />;
}
