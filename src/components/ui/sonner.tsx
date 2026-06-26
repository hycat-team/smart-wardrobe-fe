"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1A1A1A] group-[.toaster]:border group-[.toaster]:border-black/10 group-[.toaster]:shadow-lg group-[.toaster]:shadow-black/5 group-[.toaster]:rounded-2xl font-sans px-5 py-4 w-full flex gap-3",
          title: "text-sm font-semibold leading-none mt-0.5",
          description: "group-[.toast]:text-[#666666] text-[13px] leading-relaxed mt-1 text-pretty",
          actionButton:
            "group-[.toast]:bg-[#1A1A1A] group-[.toast]:text-white text-xs font-medium rounded-xl border-none px-4 py-2",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-[#1A1A1A] text-xs font-medium rounded-xl border border-black/10 px-4 py-2",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
