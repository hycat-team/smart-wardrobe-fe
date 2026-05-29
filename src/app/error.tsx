'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">Đã có lỗi xảy ra!</h2>
      <p className="text-muted-foreground">{error.message || 'Vui lòng thử lại sau.'}</p>
      <Button onClick={() => reset()} variant="default">
        Thử lại
      </Button>
    </div>
  );
}

