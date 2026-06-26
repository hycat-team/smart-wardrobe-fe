"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
interface PostShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}
export const PostShareModal = ({ isOpen, onClose, shareUrl }: PostShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Đã sao chép liên kết bài viết");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Lỗi khi sao chép liên kết");
    }
  };
  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {" "}
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border-black/5 p-6 shadow-sm">
        {" "}
        <DialogHeader className="mb-4">
          {" "}
          <DialogTitle className="font-sans text-lg font-bold">Chia sẻ bài viết</DialogTitle>{" "}
          <DialogDescription className="text-[#666] font-sans text-xs mt-1">
            {" "}
            Bất kỳ ai có liên kết này đều có thể xem bài viết{" "}
          </DialogDescription>{" "}
        </DialogHeader>{" "}
        <div className="flex items-center space-x-2 mt-2">
          {" "}
          <div className="flex-1 overflow-hidden">
            {" "}
            <input
              readOnly
              value={shareUrl}
              className="w-full bg-[#FAFAFA] border border-black/10 rounded-lg px-3 py-2 text-sm text-[#111] font-sans outline-none truncate"
            />{" "}
          </div>{" "}
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="rounded-lg h-9 w-9 p-0 flex-shrink-0 border-black/10 hover:bg-[#FAFAFA] transition-colors"
          >
            {" "}
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-[#111]" />
            )}{" "}
          </Button>{" "}
        </div>{" "}
        {/* <div className="flex items-center gap-3 mt-6"> <Button onClick={shareFacebook} variant="outline" className="flex-1 rounded-lg border-black/10 hover:bg-[#FAFAFA] hover:text-[#111] text-[#666] transition-colors font-sans font-medium text-xs h-10" > <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /> </svg> Facebook </Button> <Button onClick={shareTwitter} variant="outline" className="flex-1 rounded-lg border-black/10 hover:bg-[#FAFAFA] hover:text-[#111] text-[#666] transition-colors font-sans font-medium text-xs h-10" > <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> </svg> X (Twitter) </Button> </div> */}{" "}
      </DialogContent>{" "}
    </Dialog>
  );
};
