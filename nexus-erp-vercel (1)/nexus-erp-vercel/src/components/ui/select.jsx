import React from "react";
import { cn } from "@/lib/utils";

export function Select({ value, onValueChange, children }) {
  const trigger = React.Children.toArray(children).find((child) => child?.type?.displayName === "SelectTrigger");
  const content = React.Children.toArray(children).find((child) => child?.type?.displayName === "SelectContent");
  const options = React.Children.toArray(content?.props?.children || []).filter(Boolean);
  return (
    <select
      className={cn("flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm")}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt.props.value}>{opt.props.children}</option>
      ))}
    </select>
  );
}
export function SelectTrigger() { return null; }
SelectTrigger.displayName = "SelectTrigger";
export function SelectValue() { return null; }
export function SelectContent({ children }) { return <>{children}</>; }
SelectContent.displayName = "SelectContent";
export function SelectItem() { return null; }
SelectItem.displayName = "SelectItem";