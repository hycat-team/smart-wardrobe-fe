'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PostComposerModal } from './PostComposerModal';

export const CreatePostModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-xl shadow-primary/10 gap-2 h-11 px-6 font-medium tracking-wide text-[13px]" 
        size="default"
      >
        <Plus className="size-4" />
        <span>Tạo bài viết</span>
      </Button>

      <PostComposerModal 
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
