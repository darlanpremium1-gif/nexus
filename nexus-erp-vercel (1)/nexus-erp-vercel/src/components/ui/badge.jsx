import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className = "", variant = "default", ...props }) {
  const styles = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-700",
    destructive: "bg-red-600 text-white",
    outline: "border border-slate-200 text-slate-700 bg-white",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", styles[variant] || styles.default, className)} {...props} />;
}