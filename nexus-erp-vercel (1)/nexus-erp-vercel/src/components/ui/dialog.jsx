import React from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, children }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50">{children}</div>;
}
export function DialogContent({ className = "", children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={cn("w-full max-w-lg rounded-xl bg-white p-6 shadow-xl", className)}>{children}</div>
    </div>
  );
}
export function DialogHeader({ className = "", ...props }) {
  return <div className={cn("mb-4", className)} {...props} />;
}
export function DialogTitle({ className = "", ...props }) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}
export function DialogFooter({ className = "", ...props }) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}