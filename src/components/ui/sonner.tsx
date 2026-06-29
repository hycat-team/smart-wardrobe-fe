"use client";

import { useTheme } from "next-themes";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
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
            "group toast group-[.toaster]:flex group-[.toaster]:w-full group-[.toaster]:gap-3 group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:bg-card group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:font-sans group-[.toaster]:text-card-foreground group-[.toaster]:shadow-md",
          title:
            "mt-0.5 text-[12px] font-semibold uppercase leading-none tracking-widest text-foreground",
          description:
            "mt-1 text-[13px] font-medium leading-relaxed text-muted-foreground",
          actionButton:
            "rounded-full border-none bg-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "rounded-full border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-foreground hover:bg-muted",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
