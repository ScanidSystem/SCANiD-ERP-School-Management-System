import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ 
  render, 
  nativeButton, 
  children, 
  ...props 
}: DialogPrimitive.Trigger.Props & { asChild?: boolean }) {
  const asChild = (props as any).asChild;
  const { asChild: _, ...rest } = props as any;

  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={render ?? (asChild && React.isValidElement(children) ? children : undefined)}
      nativeButton={nativeButton ?? (!render && !asChild)}
      {...rest}
    >
      {asChild ? undefined : children}
    </DialogPrimitive.Trigger>
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ 
  render, 
  nativeButton, 
  children, 
  ...props 
}: DialogPrimitive.Close.Props & { asChild?: boolean }) {
  const asChild = (props as any).asChild;
  const { asChild: _, ...rest } = props as any;

  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={render ?? (asChild && React.isValidElement(children) ? children : undefined)}
      nativeButton={nativeButton ?? (!render && !asChild)}
      {...rest}
    >
      {asChild ? undefined : children}
    </DialogPrimitive.Close>
  )
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-slate-950/40 backdrop-blur-[6px] duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-[40px] bg-white text-sm text-popover-foreground shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] ring-0 duration-200 outline-none sm:max-w-[550px] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 flex flex-col border-none",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            nativeButton={true}
            render={
              <Button
                variant="ghost"
                className="absolute top-7 right-8 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-900 border-none transition-all z-50 active:scale-95 group shadow-xl"
                size="icon"
              />
            }
          >
            <XIcon size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />

            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("p-10 pb-2 flex flex-col gap-1.5 relative", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "bg-slate-50/50 p-10 pt-6 pb-10 flex flex-col gap-4 border-t border-slate-100 sm:flex-row sm:justify-end shrink-0",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close nativeButton={true} render={<Button variant="outline" className="rounded-xl border-slate-200" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl font-bold tracking-tight leading-tight",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-slate-400 text-xs font-black uppercase tracking-widest mt-0.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
