import * as React from "react"
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
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-4",
          description: "group-[.toast]:text-slate-500 group-[.toast]:font-medium",
          actionButton: "group-[.toast]:bg-indigo-600 group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:h-9",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:h-9",
          title: "group-[.toast]:font-bold group-[.toast]:text-[15px] group-[.toast]:tracking-tight",
          icon: "group-[.toast]:text-indigo-600 group-[.toast]:size-5",
          success: "group-[.toaster]:border-emerald-100 group-[.toaster]:bg-emerald-50/50",
          error: "group-[.toaster]:border-red-100 group-[.toaster]:bg-red-50/50",
          warning: "group-[.toaster]:border-amber-100 group-[.toaster]:bg-amber-50/50",
          info: "group-[.toaster]:border-blue-100 group-[.toaster]:bg-blue-50/50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
