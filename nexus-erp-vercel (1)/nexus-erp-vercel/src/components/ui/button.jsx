import React from "react";
import { cn } from "@/lib/utils";

export function Button({ className = "", variant = "default", size = "default", ...props }) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-11 px-5 text-sm",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn("inline-flex items-center justify-center gap-2 rounded-md transition disabled:opacity-50 disabled:pointer-events-none", variants[variant] || variants.default, sizes[size] || sizes.default, className)}
      {...props}
    />
  );
}