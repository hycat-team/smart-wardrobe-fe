import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Closy. Nền tảng thời trang cho thương hiệu địa phương.</p>
        <div className="flex items-center gap-4">
          <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground" render={<Link href="/privacy" />}>
            Chính sách bảo mật
          </Button>
          <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground" render={<Link href="/brands" />}>
            Khám phá thương hiệu
          </Button>
        </div>
      </div>
    </footer>
  );
}
