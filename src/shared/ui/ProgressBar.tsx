interface Props {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: Props) {
  return (
    <div className={`h-2 w-full rounded-full bg-slate-200 overflow-hidden ${className ?? ""}`}>
      <div
        className="h-full bg-brand-500 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}