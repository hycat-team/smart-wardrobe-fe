import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {" "}
      <AdminSidebar />{" "}
      <div className="flex-1 flex flex-col min-w-0">
        {" "}
        <AdminHeader /> <main className="flex-1 p-6 overflow-auto"> {children} </main>{" "}
      </div>{" "}
    </div>
  );
}
