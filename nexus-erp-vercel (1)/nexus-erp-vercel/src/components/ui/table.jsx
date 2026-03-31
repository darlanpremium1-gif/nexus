import React from "react";
import { cn } from "@/lib/utils";

export function Table({ className = "", ...props }) { return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />; }
export function TableHeader(props) { return <thead {...props} />; }
export function TableBody(props) { return <tbody {...props} />; }
export function TableRow({ className = "", ...props }) { return <tr className={cn("border-b", className)} {...props} />; }
export function TableHead({ className = "", ...props }) { return <th className={cn("h-10 px-4 text-left align-middle font-medium text-slate-500", className)} {...props} />; }
export function TableCell({ className = "", ...props }) { return <td className={cn("p-4 align-middle", className)} {...props} />; }