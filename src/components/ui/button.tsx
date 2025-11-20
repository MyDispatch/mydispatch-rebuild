import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import "./button-styles.css";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-default bg-slate-700 text-white hover:bg-slate-800 hover:text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        destructive: "btn-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        outline: "btn-outline border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm",
        secondary: "btn-secondary bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:text-secondary-foreground hover:shadow-sm",
        ghost: "btn-ghost text-slate-900 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm active:bg-slate-200",
        link: "btn-link text-slate-900 underline-offset-4 hover:underline hover:text-slate-900",
        quickAction: "btn-quick-action w-full justify-start text-slate-900 bg-transparent hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] hover:border-slate-300",
        "primary-filled": "bg-secondary text-background border border-secondary hover:bg-secondary-hover hover:text-background hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        "primary-outline": "bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-background hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]",
        "beige-filled": "bg-primary text-foreground border border-primary hover:bg-primary-hover hover:text-foreground hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        "quick-action-primary": "bg-slate-700 text-white border border-slate-700 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
