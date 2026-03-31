import React, { createContext, useContext } from "react";

const TabsContext = createContext({ value: "", onValueChange: () => {} });

export function Tabs({ value, onValueChange, className = "", children }) {
  return <div className={className}><TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider></div>;
}
export function TabsList({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
export function TabsTrigger({ value, children, className = "" }) {
  const ctx = useContext(TabsContext);
  return <button className={className} onClick={() => ctx.onValueChange?.(value)}>{children}</button>;
}
export function TabsContent({ value, children, className = "" }) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}