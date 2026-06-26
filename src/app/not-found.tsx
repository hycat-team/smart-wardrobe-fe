import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {" "}
      <h2 className="text-4xl font-bold">404</h2>{" "}
      <p className="text-xl text-muted-foreground">Không tìm thấy trang yêu cầu</p>{" "}
      <Button variant="default">
        {" "}
        <Link href="/">Quay lại trang chủ</Link>{" "}
      </Button>{" "}
    </div>
  );
}
