import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm",
        className
      )}
      {...rest}
    />
  );
}