/* ==================================================================================
   V28 DIALOG COMPONENT V28.1 - WRAPPER FOR RADIX DIALOG
   ==================================================================================
   ✅ Wraps @radix-ui/react-dialog
   ✅ Pure Tailwind Slate Styling
   ✅ Backward Compatible mit shadcn Dialog API
   ================================================================================== */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const V28Dialog = DialogPrimitive.Root;

const V28DialogTrigger = DialogPrimitive.Trigger;

const V28DialogPortal = DialogPrimitive.Portal;

const V28DialogClose = DialogPrimitive.Close;

const V28DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
V28DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const V28DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <V28DialogPortal>
    <V28DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-600">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </V28DialogPortal>
));
V28DialogContent.displayName = DialogPrimitive.Content.displayName;

const V28DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
V28DialogHeader.displayName = "V28DialogHeader";

const V28DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
V28DialogFooter.displayName = "V28DialogFooter";

const V28DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-slate-900",
      className
    )}
    {...props}
  />
));
V28DialogTitle.displayName = DialogPrimitive.Title.displayName;

const V28DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-600", className)}
    {...props}
  />
));
V28DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  V28Dialog,
  V28DialogPortal,
  V28DialogOverlay,
  V28DialogClose,
  V28DialogTrigger,
  V28DialogContent,
  V28DialogHeader,
  V28DialogFooter,
  V28DialogTitle,
  V28DialogDescription,
};

/**
 * USAGE EXAMPLE:
 * 
 * <V28Dialog>
 *   <V28DialogTrigger asChild>
 *     <button>Dialog öffnen</button>
 *   </V28DialogTrigger>
 *   <V28DialogContent>
 *     <V28DialogHeader>
 *       <V28DialogTitle>Titel</V28DialogTitle>
 *       <V28DialogDescription>
 *         Beschreibung hier
 *       </V28DialogDescription>
 *     </V28DialogHeader>
 *     <div>Content</div>
 *     <V28DialogFooter>
 *       <button>Abbrechen</button>
 *       <button>Bestätigen</button>
 *     </V28DialogFooter>
 *   </V28DialogContent>
 * </V28Dialog>
 */
