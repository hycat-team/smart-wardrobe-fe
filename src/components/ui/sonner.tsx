"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

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
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1A1A1A] group-[.toaster]:border group-[.toaster]:border-[#1A1A1A] group-[.toaster]:shadow-sm group-[.toaster]:rounded-none font-sans px-5 py-4 w-full flex gap-3",
          title: "text-[12px] font-bold uppercase tracking-widest leading-none mt-0.5",
          description: "group-[.toast]:text-[#666666] text-[13px] font-medium leading-relaxed mt-1",
          actionButton:
            "group-[.toast]:bg-[#1A1A1A] group-[.toast]:text-white text-[10px] font-bold uppercase tracking-widest rounded-none border-none px-4 py-2",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest rounded-none border border-[#1A1A1A] px-4 py-2",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

